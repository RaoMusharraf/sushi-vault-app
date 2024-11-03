// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";


interface IERC4626 {
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function mint(uint256 shares, address receiver) external returns (uint256 assets);
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets);
    function totalAssets() external view returns (uint256);
    function convertToShares(uint256 assets) external view returns (uint256 shares);
    function convertToAssets(uint256 shares) external view returns (uint256 assets);
}

interface ISushiBar {
    function enter(uint256 _amount) external;
    function leave(uint256 _share) external;
    function transfer(address to,uint256 value) external;
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender,uint256 amount) external;
    function totalSupply() external view returns (uint256);
}

contract ERC4626Vault is ERC20, IERC4626, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint24 public constant poolFee = 500;

    address public constant Sushi = 0xB6ffC8FD1915d24f43De8FAE8B89855837138935;
    address public constant SushiBar = 0x4C3c929B59B09f6DfE330FDe9c96174599F4A03F;
    address public constant routerAddress = 0x0b343475d44EC2b4b8243EBF81dc888BF0A14b36;
    
    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);
    
    uint256 public totalAssets;

    constructor( string memory _name, string memory _symbol) ERC20(_name, _symbol){ }

    // Calculate shares based on current exchange rate
    function convertToShares(uint256 assets) public view override returns (uint256 shares) {
        return (totalSupply() == 0) ? assets : (assets * totalSupply()) / totalAssets;
    }

    // Calculate assets based on shares
    function convertToAssets(uint256 shares) public view override returns (uint256 assets) {
        return (totalSupply() == 0) ? shares : (shares * totalAssets) / totalSupply();
    }

    // Deposit assets to mint shares
    function deposit(uint256 assets, address receiver) public override nonReentrant returns (uint256 shares) {
        require(assets > 0, "Deposit amount must be greater than 0");
        shares = convertToShares(assets);
        totalAssets += assets;
        _mint(receiver, shares);
        emit Deposit(msg.sender, receiver, assets, shares);
    }

    // Mint shares by depositing assets
    function mint(uint256 shares, address receiver) external override nonReentrant returns (uint256 assets) {
        require(shares > 0, "Mint amount must be greater than 0");
        assets = convertToAssets(shares);
        totalAssets += assets;
        // ISushiBar(SushiBar).transferFrom(SushiBar,address(this),shares);
        _mint(receiver, shares);
        emit Mint(msg.sender, receiver, assets, shares);
    }

    // Withdraw assets by burning shares
    function withdraw(uint256 assets, address receiver,address owner) public override nonReentrant returns (uint256 shares) {
        require(assets > 0, "Withdraw amount must be greater than 0");
        shares = convertToShares(assets);
        _burn(owner, shares);
        totalAssets -= assets;
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
    }

    // Redeem shares for underlying assets
    function redeem(uint256 shares, address receiver, address owner) external override nonReentrant returns (uint256 assets) {
        require(shares > 0, "Redeem amount must be greater than 0");

        assets = convertToAssets(shares);
        _burn(owner, shares);
        totalAssets -= assets;
        // ISushiBar(SushiBar).transfer(SushiBar,address(this),shares);
        emit Redeem(msg.sender, receiver, owner, assets, shares);
    }


    function ZapIn(uint256 amountIn,address tokenAddress) public
    {
        require(amountIn > 0, "Redeem amount must be greater than 0");
        if(tokenAddress != Sushi){
            uint sushiSwapAmount = swapExactInputSingle(amountIn, address(this), tokenAddress,Sushi);
            IERC20(Sushi).approve(SushiBar, sushiSwapAmount);
            ISushiBar(SushiBar).enter(sushiSwapAmount);
            deposit(amountIn,msg.sender);
        }else {
            IERC20(Sushi).safeTransferFrom(msg.sender, address(this), amountIn);
            IERC20(Sushi).approve(SushiBar, amountIn);
            ISushiBar(SushiBar).enter(amountIn);
            deposit(amountIn,msg.sender);
        }
    }
    function ZapOut(uint256 amountIn,address tokenAddress) public
    {
        require(amountIn > 0, "Redeem amount must be greater than 0");
        if(tokenAddress != Sushi){
            withdraw(amountIn, address(this), msg.sender);
            ISushiBar(SushiBar).leave(amountIn);
            IERC20(Sushi).transfer(msg.sender, amountIn);
            swapExactInputSingle(amountIn, msg.sender, Sushi, tokenAddress);
        }else {
            withdraw(amountIn, address(this), msg.sender);
            ISushiBar(SushiBar).leave(amountIn);
            IERC20(Sushi).transfer(msg.sender, amountIn);
        }
    }

    function swapExactInputSingle(uint256 amountIn,address recipientAddresss,address tokenIn,address tokenOut) internal returns (uint256 amountOut)
    {
        IERC20(tokenIn).approve(address(swapRouter), amountIn);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: recipientAddresss,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        amountOut = swapRouter.exactInputSingle(params);
    }
    function swapExactInputMultihop(uint256 amountIn, address recipientAddresss, address tokenAddress) internal returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(tokenAddress, msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(tokenAddress, address(swapRouter), amountIn);
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(tokenAddress, poolFee, Sushi, poolFee, WETH),
                recipient: recipientAddresss,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0
            });
        amountOut = swapRouter.exactInput(params);
    }

    // Events for tracking deposits, mints, withdrawals, and redeems
    event Deposit(address indexed from, address indexed to, uint256 assets, uint256 shares);
    event Mint(address indexed from, address indexed to, uint256 assets, uint256 shares);
    event Withdraw(address indexed from, address indexed to, address indexed owner, uint256 assets, uint256 shares);
    event Redeem(address indexed from, address indexed to, address indexed owner, uint256 assets, uint256 shares);
}


/* -- set app title --*/
const AppTitle = 'Sushi Swap';

/* -- set app mode -- */
const AppMode = [''];
// const AppMode = ['development'];


// let SocketUrl, opensea;
let env = AppMode[0] || 'development', networkId = '', message = '', explorer = '';

// switch (AppMode[0]) {
//     case 'development':
//         networkId = 11155111;
//         SocketUrl = 'http://localhost:4000';
//         explorer = 'https://sepolia.lineascan.build'
//         message = 'Please switch your network to sepolia testnet';
//         opensea = 'https://testnets.opensea.io/'
//         break;
//     case 'production':
//         networkId = 1;
//         SocketUrl = production;
//         message = 'Please switch your network to Ethereum Mainnet';
//         explorer = 'https://etherscan.io'
//         opensea = 'https://opensea.io/'
//         break;
//     case 'testing':
//         networkId = 11155111;
//         SocketUrl = 'http://localhost:4000';
//         message = 'Please switch your network to sepolia lineascan testnet';
//         explorer = 'https://sepolia.lineascan.build'
//         opensea = 'https://testnets.opensea.io/'
//         break;
//     default:
//         networkId = 11155111;
//         SocketUrl = 'http://localhost:4000';
//         message = 'Please switch your network to sepolia testnet';
//         explorer = 'https://sepolia.lineascan.build'
//         opensea = 'https://testnets.opensea.io/'
// }

// let ApiUrl = `${SocketUrl}/api`;

export { env };

// export { AppTitle, ApiUrl, SocketUrl, opensea, networkId, message, explorer, env };
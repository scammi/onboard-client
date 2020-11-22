 
## hack.ethglobal
 https://hack.ethglobal.co/showcase/onboarding-emyto-recGO8tQTDYp01IG7
 
## Description
We are tokenizing a container that will be sold for profit, the container holds goods that will be exported from Brazil to Venezuela. Tokens will be distributed to investors in proportion to their share.

Since users are not familiar with ethereum, we are creating a platform that hides the complexity of the web3 implementations. Investors will use the ethereum network without even realizing it. The usage of the platform must feel intuitive and natural, removing the usage of wallets, transactions, and key management.

Users will create their wallets using our front-end, the NTF will be sent to their account once they finalized their payment using an escrow.
The project is meant as a proof of concept, and we are using the ethereum network as a ledger to track the investor's share.


## How It's Made
The project uses onboard.money API in the background to manage the user’s keys and transactions. User accounts are managed by onboard and the keys remain in their custody. Our application is a front end client that enables the creation of users and transactions.
https://docs.onboard.money.

Node.js and mySQL are used to store the user's credentials and addresses. And we are using https://tokenmint.io/ to tokenize the container.

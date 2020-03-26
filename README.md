# navienbot
Navienuk Chatbot

# AWS Cognito Identity Pool

## for Javascript 

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'eu-west-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-1:4bd0ff1e-c5d6-4b04-90a0-678e31e71479',
});

## Class: AWS.CognitoIdentity

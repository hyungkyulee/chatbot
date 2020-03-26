# navienbot
Navienuk Chatbot

# AWS Cognito Identity Pool

## for Javascript 

You get the pool ID that you need for the JavaScript you will use to integrate the bot.
```
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'eu-west-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-1:4bd0ff1e-c5d6-4b04-90a0-678e31e71479',
});
```

You modify the IAM roles to allow access to Amazon Lex. From the IAM console, you find the roles and change each of them to attach the AmazonLexRunBotsOnly and AmazonPollyReadOnlyAccess policies:

Service -> IAM -> Role -> Search my cognitoIdentity
-> AttachPolicy -> Search and check both of policie names - AmazonLexRunBotsOnly and AmazonPollyReadOnlyAccess

Test your chatbot on the web
You quickly put together an HTML file that you can use to test your bot. The pool ID is used here to establish an IAM session.

```
<!DOCTYPE html>
<html>

<head>
	<title>Amazon Lex for JavaScript - Sample Application (BookTrip)</title>
	<script src="https://sdk.amazonaws.com/js/aws-sdk-2.41.0.min.js"></script>
	<style language="text/css">
		input#wisdom {
			padding: 4px;
			font-size: 1em;
			width: 400px
		}

		input::placeholder {
			color: #ccc;
			font-style: italic;
		}

		p.userRequest {
			margin: 4px;
			padding: 4px 10px 4px 10px;
			border-radius: 4px;
			min-width: 50%;
			max-width: 85%;
			float: left;
			background-color: #7d7;
		}

		p.lexResponse {
			margin: 4px;
			padding: 4px 10px 4px 10px;
			border-radius: 4px;
			text-align: right;
			min-width: 50%;
			max-width: 85%;
			float: right;
			background-color: #bbf;
			font-style: italic;
		}

		p.lexError {
			margin: 4px;
			padding: 4px 10px 4px 10px;
			border-radius: 4px;
			text-align: right;
			min-width: 50%;
			max-width: 85%;
			float: right;
			background-color: #f77;
		}
	</style>
</head>

<body>
	<h1 style="text-align:  left">Amazon Lex - BookTrip</h1>
	<p style="width: 400px">
		This little chatbot shows how easy it is to incorporate
		<a href="https://aws.amazon.com/lex/" title="Amazon Lex (product)" target="_new">Amazon Lex</a> into your web pages.  Try it out.
	</p>
	<div id="conversation" style="width: 400px; height: 400px; border: 1px solid #ccc; background-color: #eee; padding: 4px; overflow: scroll"></div>
	<form id="chatform" style="margin-top: 10px" onsubmit="return pushChat();">
		<input type="text" id="wisdom" size="80" value="" placeholder="I need a hotel room">
	</form>
	<script type="text/javascript">
		// set the focus to the input box
		document.getElementById("wisdom").focus();

		// Initialize the Amazon Cognito credentials provider
		AWS.config.region = 'us-east-1'; // Region
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		// Provide your Pool Id here
			IdentityPoolId: 'us-east-1:XXXXX',
		});

		var lexruntime = new AWS.LexRuntime();
		var lexUserId = 'chatbot-demo' + Date.now();
		var sessionAttributes = {};

		function pushChat() {

			// if there is text to be sent...
			var wisdomText = document.getElementById('wisdom');
			if (wisdomText && wisdomText.value && wisdomText.value.trim().length > 0) {

				// disable input to show we're sending it
				var wisdom = wisdomText.value.trim();
				wisdomText.value = '...';
				wisdomText.locked = true;

				// send it to the Lex runtime
				var params = {
					botAlias: '$LATEST',
					botName: 'BookTrip',
					inputText: wisdom,
					userId: lexUserId,
					sessionAttributes: sessionAttributes
				};
				showRequest(wisdom);
				lexruntime.postText(params, function(err, data) {
					if (err) {
						console.log(err, err.stack);
						showError('Error:  ' + err.message + ' (see console for details)')
					}
					if (data) {
						// capture the sessionAttributes for the next cycle
						sessionAttributes = data.sessionAttributes;
						// show response and/or error/dialog status
						showResponse(data);
					}
					// re-enable input
					wisdomText.value = '';
					wisdomText.locked = false;
				});
			}
			// we always cancel form submission
			return false;
		}

		function showRequest(daText) {

			var conversationDiv = document.getElementById('conversation');
			var requestPara = document.createElement("P");
			requestPara.className = 'userRequest';
			requestPara.appendChild(document.createTextNode(daText));
			conversationDiv.appendChild(requestPara);
			conversationDiv.scrollTop = conversationDiv.scrollHeight;
		}

		function showError(daText) {

			var conversationDiv = document.getElementById('conversation');
			var errorPara = document.createElement("P");
			errorPara.className = 'lexError';
			errorPara.appendChild(document.createTextNode(daText));
			conversationDiv.appendChild(errorPara);
			conversationDiv.scrollTop = conversationDiv.scrollHeight;
		}

		function showResponse(lexResponse) {

			var conversationDiv = document.getElementById('conversation');
			var responsePara = document.createElement("P");
			responsePara.className = 'lexResponse';
			if (lexResponse.message) {
				responsePara.appendChild(document.createTextNode(lexResponse.message));
				responsePara.appendChild(document.createElement('br'));
			}
			if (lexResponse.dialogState === 'ReadyForFulfillment') {
				responsePara.appendChild(document.createTextNode(
					'Ready for fulfillment'));
				// TODO:  show slot values
			} else {
				responsePara.appendChild(document.createTextNode(
					'(' + lexResponse.dialogState + ')'));
			}
			conversationDiv.appendChild(responsePara);
			conversationDiv.scrollTop = conversationDiv.scrollHeight;
		}
	</script>
</body>

</html>
```

## Class: AWS.CognitoIdentity

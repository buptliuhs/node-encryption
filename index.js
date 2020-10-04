const crypto = require("crypto");
const ENCRYPTION_ALG = "aes-256-ctr";
const DIGEST_ALG = "sha512";
const IV_LENGTH = 16;
const pubKeyPem = "-----BEGIN PUBLIC KEY-----\n" +
		"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjvo75YzUw4prvdnbWWrr\n" +
		"sOhpOrKHVSV2bc9L1umT5DpyrvuWKScEnaqsDfEEjC69he06h/Vy4OeNN9djQtaB\n" +
		"nrJ+bSfJr3l3UNaEBvlgRD7DWZJdZz+1n7brHiZeGE+/VZpNqnEs8loGgoLGRUUS\n" +
		"lFi8A9gb15n2bRw60vF6xAev5veQPA1GgKmoEGXIKyH0fw1V5jV0/bjg+AtSzQyV\n" +
		"bIR6RVeOjsbyUVzljUmgZAZUhEnQ5I/GySVB20uQS/8XJbFr80FEMliMKOpgphYC\n" +
		"kY/yE5gFG4/JXV/9fAzqzmDIxB1iYpAxLmjQ1ZzVYDjmLKn7gZ5AtNYrCLn99Nz0\n" +
		"6wIDAQAB\n" +
		"-----END PUBLIC KEY-----";
const privKeyPem = "-----BEGIN RSA PRIVATE KEY-----\n" +
		"MIIEowIBAAKCAQEAjvo75YzUw4prvdnbWWrrsOhpOrKHVSV2bc9L1umT5DpyrvuW\n" +
		"KScEnaqsDfEEjC69he06h/Vy4OeNN9djQtaBnrJ+bSfJr3l3UNaEBvlgRD7DWZJd\n" +
		"Zz+1n7brHiZeGE+/VZpNqnEs8loGgoLGRUUSlFi8A9gb15n2bRw60vF6xAev5veQ\n" +
		"PA1GgKmoEGXIKyH0fw1V5jV0/bjg+AtSzQyVbIR6RVeOjsbyUVzljUmgZAZUhEnQ\n" +
		"5I/GySVB20uQS/8XJbFr80FEMliMKOpgphYCkY/yE5gFG4/JXV/9fAzqzmDIxB1i\n" +
		"YpAxLmjQ1ZzVYDjmLKn7gZ5AtNYrCLn99Nz06wIDAQABAoIBADfXS6Vvx3lHiqTv\n" +
		"fVgDBmJloxOlvm1m4EYq/DfHqlcs7LWi1RblgkwB6IjZZSlK6AJykLWhC2kDhogU\n" +
		"u1PTa3SLygzfyUmbaxpLbe07YHnG+Yz2OTymCU2Dp3hzC7T7EINibIrxANj2iCxY\n" +
		"3w8W1xbRQT1PHjCqlTAwIllYrtX4hHTa4lQGhr4okf7EX4BFDw61i7/wwIRUXaWj\n" +
		"0LBFj8XczPxN5iVhEi/Coizz82zpfGWwfQIasAuMt6BFntNrW770ERxMM/+aMfUS\n" +
		"BRlzNu2nOiXbIoJsZOoNz/1Hmf3kSMtGWYIykoAOy0Jquu9+71ydOrkN3FIGkBZq\n" +
		"+Q2zWyECgYEA0w99/nmxrbVm6+X6+YbutO19JuiBli+9ZXxVmBTmD3ux9J+l//E9\n" +
		"f5ja8wtXBwaSy/cHcPkhv+6BZyVRNuvily2+H/5cXLGDyJ1byxdSVEGbS5UIziKM\n" +
		"q045DnlOQabSsChVxYMPgypAGz3qO1XWO+WMo/sWy/N2F4NoRwP7528CgYEArWuq\n" +
		"JSc0e6mfTtXSACmnyxKeCofMlvFMjiVm2pA94uvGnJmK93Bgr6RWFMHQ/XO5xXMW\n" +
		"Gc2CFqJX+IFv77+f2UeGUayCfGiQvNTZQRHcmdxGqki8+m17OQn2ySJGFtYzGFU3\n" +
		"n1kUsiaNK/+76N7hQaA+HRfyLdNPLCeiSuCXrEUCgYEAps0tk/n1NAWTS4e8K4w6\n" +
		"Bv9R03gZQeqE0jnLI6AQmdf2MhAiDv5GzhqtnzstEj5dsZiPZvddduQ1nKDfaHpP\n" +
		"346lHX/W2uLn9Zp3OzA5PqGC697i0JZ5ecEeUpQIBtai19lov+nuTokLlPv/q9kQ\n" +
		"sNGfrtD3mUPV5otR1B4P7T0CgYAvXQdULFf2KkZ7NoSrTLUqDkShpaMn2nFJJUfp\n" +
		"C5oLXs+Yt4qvt76AWga0lpaokjG7jooLtAgCfIZANcHHnfNfWVyC8/WTWs+k8xD+\n" +
		"54zzbKjUGxeZ4crUsjb3iefQluHPlH6jg6XWXhcSXD8LA8xLqyMruP2IrHykF5MI\n" +
		"ljx2bQKBgAbYYwZcQltc3qfqTDQzRafFbtrNWSOL2JuTJdVROFoxHZOACkNGdEuH\n" +
		"QtatA+ChQSukxUTs7Z2iEcZoI+eEq7aqKJUbY6ODsk+wOaiXGGGv+81kTT41NCGs\n" +
		"jPGpYA5SHED4nE7FHHLDP+kgwMSW9VVQMVxxPP/oKVaW6N5KnIq4\n" +
		"-----END RSA PRIVATE KEY-----";

function encrypt(payload) {
	const seed = Buffer.from(crypto.randomBytes(IV_LENGTH));
	const key = crypto.pbkdf2Sync(seed, crypto.randomBytes(32), 100000, 32, DIGEST_ALG);
	const iv = Buffer.from(crypto.randomBytes(IV_LENGTH));
	const password = seed.toString("base64") + "." + key.toString("base64") + "." + iv.toString("base64");
	const cipher = crypto.createCipheriv(ENCRYPTION_ALG, key, iv);
	var encrypted = cipher.update(payload, "utf8", "base64");
	encrypted += cipher.final("base64");
	const encryptedPayload = {
		password: crypto.publicEncrypt(pubKeyPem, Buffer.from(password)).toString("base64"),
		payload: encrypted,
	};
	return encryptedPayload;
}

function decrypt(encryptedPayload) {
	const password = crypto.privateDecrypt(privKeyPem, Buffer.from(encryptedPayload.password, "base64")).toString();
	const [seed, key, iv] = password.split(".");
	const decipher = crypto.createDecipheriv(ENCRYPTION_ALG, Buffer.from(key, "base64"), Buffer.from(iv, "base64"));
	let decrypted = decipher.update(encryptedPayload.payload, "base64", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
}

for (var i = 0; i < 20; i ++) {
	// Encrypt
	var encryptedPayload = encrypt("Hello world!");
	console.log(encryptedPayload);
	// Decrypt
	var decrypted = decrypt(encryptedPayload);
	console.log(decrypted);
}

# Sparkpost Recipient Composer

It's just a small webpage to easily allow a human to compose `To`, `Cc` and `Bcc` fields to be used as
input in the [Sparkpost API for NodeJs](https://github.com/SparkPost/node-sparkpost) recipient json entry.

## Usage example

if one needs to send an email to `to@domain.com` and carbon copy it to `cc@domain.com` as well send 
2 blind carbon copy to `bcc1@domain.com` and `bcc2@domain.com` the page result would be:

```javascript
recipients:[{"address":{"email":"to@domain.com"},"substitution_data":{"recipient_type":"Original"}},{"address":{"email":"cc@domain.com","header_to":"to@domain.com"},"substitution_data":{"recipient_type":"CC"}},{"address":{"email":"bcc1@domain.com","header_to":"to@domain.com"},"substitution_data":{"recipient_type":"BCC"}},{"address":{"email":"bcc2@domain.com","header_to":"to@domain.com"},"substitution_data":{"recipient_type":"BCC"}}]
```

in the API, one would setup a `transmission` object as:

```javascript

    import SparkPost from 'sparkpost';
    const sparky = new SparkPost('you api key');
    
    ...
    
    sparky.transmissions.send({
        options: {
            sandbox: false
        },
        content: {
            from: 'Me, Myself & I <me@domain.com>',
            subject: 'My subject',
            html:'<html><body>' + emailMsg + '</body></html>'
        },
        recipients: recipients
    })
    .then(data => {
        // all good
    })
    .catch(err => {
        // error found
    });
    
```

I hope this helps someone cause I've been spending to much time setting up these. 
BTW, I normally save the recipients in the database so i can easily retrieve for use and be easily changed when needed.

## Composer page

Project is hosted as GitHub pages @ https://balexandre.github.io/sparkpost-recipient-composer/index.html

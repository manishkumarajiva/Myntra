const SendTokenCookies = (response, token, status, message, res) => {

    const options = new Object({
        expires: new Date(Date.now() +  2 * 60 * 60 * 1000),
        signed : true,
        httpOnly: true,
        secure : true,
        domain : "localhost",
        path : '/'
    });

    res.cookie("Token", token, options);
    res.status(status).json({ status, response, token, message });
};

module.exports =  SendTokenCookies;
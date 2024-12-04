const EMAILS = {
    "Запрос ценового предложения": "aadavidenkoweb@yandex.ru",
    "Интеграторам": "aadavidenkoweb@yandex.ru",
};


class Nodemail {
    to(value) {
        return value;
    }
}
const MAILS = {
    default: "4neroq4@gmail.com",
    case: ""
};

function sendManyEmail(value, mailer = null) {
    MAILS.case = value;
    return mailer.to(MAILS.case);
}

test('add', () => {
    expect(sendManyEmail('aadavidenkoweb@yandex.ru', new Nodemail())).toEqual("aadavidenkoweb@yandex.ru");
});
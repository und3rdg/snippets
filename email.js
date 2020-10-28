// @parm({value: value, type: type})
//     -> return BOOL
function is_field_not_valid({value: value, type: type}) {
    // https://jex.im/regulex/
    const regexp_for_phone = /^(^\+?[0-9]+)? ?(^\+?[0-9]+|\(\+?[0-9]+\)) ?((([0-9]{2}|[0-9]{3}))(|-| )?)+$/

    // eslint-disable-next-line no-control-regex, max-len
    const regexp_for_email = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/

    // eslint-disable-next-line max-len
    const regexp_for_password = /^(?=([a-zA-Z0-9]){8}([a-zA-Z0-9])*)([a-zA-Z0-9]*([0-9][a-zA-Z]|[a-zA-Z][0-9])[a-zA-Z0-9]*)$/

    let test = /.*/
    if(type === "Mobile") {
        test = regexp_for_phone
    }
    if(type === "Email") {
        test = regexp_for_email
    }
    if(type === "password") {
        test = regexp_for_password
    }
    const regex = RegExp(test)

    // validate only non empty string.
    // another validator will check if field is required.
    const ok = value !== ""
        ? !regex.test(value)
        : false
    return ok
}




// test's from TDD - mocha/chai
describe('EMAIL should be', ()=> {
    describe('VALID', ()=> {
        [
            "a!a@a.aa",
            "a$a@a.aa",
            "a^a@a.aa",
            "a%a@a.aa",
            "niceandsimple@example.com",
            "a.little.unusual@example.com",
            "a.little+unusual@example.com",
            "a.little.more.unusual@dept.example.com",
            // they should be valid according to email specification
            // but realistically no one using emails like that
            // 'much."more\ unusual"@example.com',
            // 'very.unusual."@".unusual.com@example.com',
            // 'very."(),:;<>[]".VERY."very@\\\ \"very".unusual@strange.example.com',
        ].forEach(email => {
            const test = is_field_not_valid({
                value: email,
                type: "Email",
            })
            it(`${email} should return FALSE`, () => expect(test).to.be.false )
        })
    })

    describe('INVALID', ()=> {
        [
            "Abc.example.com",
            // (an @ character must separate the local and domain parts)

            "Abc.@example.com",
            // (character dot(.) is last in local part)

            'Abc..123@example.com',
            // (character dot(.) is double)

            'A@b@c@example.com',
            // (one @ is allowed outside quotation marks)

            // eslint-disable-next-line no-useless-escape
            'a"b(c)d,e:f;g<h>i[j\k]l@example.com',
            // (none of the special characters in this local part is allowed outside quotation marks)

            'just"not"right@example.com',
            // (quoted strings must be dot separated, or the element making up the local-part)

            // eslint-disable-next-line no-useless-escape
            'this is"not\allowed@example.com',
            // (spaces, quotes, and backslashes may exist when within quoted strings and preceded by a slash)

            // eslint-disable-next-line no-useless-escape
            "this\ still\"not\\allowed@example.com",
            //(even if escaped (preceded by a backslash), spaces, quotes, and backslashes
            //must still be contained by quotes)
        ].forEach(email => {
            const test = is_field_not_valid ({
                value: email,
                type: "Email",
            })
            it(`${email} should return TRUE`, ()=> expect(test).to.be.true )
        })
    })
})

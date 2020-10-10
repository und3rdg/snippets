/**
 * mocha helper, change before and after to beforeAl
 * and afterAll to convert it to jest helper
 *
 * @example chai BDD
 * it('can stub the global date object', () => {
 *     const myDate = new Date('2022-02-28T09:39:59')
 *     stubDate(myDate)
 *     expect(Date.now()).to.eq(1519807199000)
 * })
 */
export const stubDate = fixedDate => {
    let _originalDate

    before(() => {
        _originalDate = Date

        Date = class extends Date {
            constructor() {
                super()

                return fixedDate
            }
        }
    })

    after(() => {
        Date = _originalDate
    })
}

import * as CreateTransactionService from "./CreateTransactionService"
// @ponicode
describe("execute", () => {
    let inst: any

    beforeEach(() => {
        inst = new CreateTransactionService.default()
    })

    test("0", async () => {
        await inst.execute({ title: "Internal Interactions Strategist", value: 64, type: "outcome", category_title: "International Intranet Coordinator" })
    })

    test("1", async () => {
        await inst.execute({ title: "International Intranet Coordinator", value: 10, type: "outcome", category_title: "Future Interactions Representative" })
    })

    test("2", async () => {
        await inst.execute({ title: "Dynamic Quality Specialist", value: 0, type: "income", category_title: "Internal Interactions Strategist" })
    })

    test("3", async () => {
        await inst.execute({ title: "Future Interactions Representative", value: 64, type: "outcome", category_title: "Direct Functionality Orchestrator" })
    })

    test("4", async () => {
        await inst.execute({ title: "Future Interactions Representative", value: 0, type: "outcome", category_title: "Internal Interactions Strategist" })
    })

    test("5", async () => {
        await inst.execute({ title: "", value: Infinity, type: "income", category_title: "" })
    })
})

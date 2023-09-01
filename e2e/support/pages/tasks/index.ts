import { Page, expect, Locator } from "@playwright/test"
import { TaskModel } from "../../../fixtures/task.model"

export class TasksPage {
    readonly page: Page
    readonly inputTaskName: Locator

    // atraves do this chamo a propriedade do tipo page e esse construtor recebe como argumento o contexto page que vem la do teste 
    //para poder passar o contexto para classe e a classe atraves das funções conseguir manipular os elementos dentro do navegador  
    constructor(page: Page) {
        this.page = page
        this.inputTaskName = page.locator('input[class*=InputNewTask]')
    }

    async go() {
        // E que estou na página de cadastro
        await this.page.goto('/')//só usa await quando for um step
    }

    async create(task: TaskModel) {
        // vai ter que fazer um this para acesso o contexto pela propriedade
        await this.inputTaskName.fill(task.name)
        //await page.click('xpath=//button[contains(text(),"Create")]') Mesma tecnica usada embaixo
        await this.page.click('css=button >> text=Create') //usando o clique no botão normalmente
    }

    async createEnter(task: TaskModel) {
        // vai ter que fazer um this para acesso o contexto pela propriedade
        await this.inputTaskName.fill(task.name)
        //await page.click('xpath=//button[contains(text(),"Create")]') Mesma tecnica usada embaixo
        await this.inputTaskName.press('Enter') //é uma função que vai simular pressão do próprio teclado
    }

    async toggle(taskName: string) {
        const target = this.page.locator(`//p[text()="${taskName}"]/..//button[contains(@class, "Toggle")]`)
        await target.click()
    }

    async remove(taskName: string) {
        const target = this.page.locator(`//p[text()="${taskName}"]/..//button[contains(@class, "Delete")]`)
        await target.click()
    }

    async shouldHaveText(taskName: string) {
        // então essa tarefa deve ser exibida na lista
        //const target = page.locator('css=.task-item p >> text=' + taskName)
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).toBeVisible()
    }

    async alertHaveText(text: string) {
        const target = this.page.locator('.swal2-html-container')//para classe usar apenas o ponto antes buscando por css select
        await expect(target).toHaveText(text)
    }

    async shouldbeDone(taskName: string){
        const target = this.page.getByText(taskName)
        await expect(target).toHaveCSS('text-decoration-line', 'line-through')
    }

    async shouldNotExist(taskName: string) {
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).not.toBeVisible()
    }

}
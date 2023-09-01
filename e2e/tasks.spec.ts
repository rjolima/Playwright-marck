import { expect, test } from '@playwright/test'
import { StringColorFormat, faker } from '@faker-js/faker';
import { TaskModel } from './fixtures/task.model';
import { deleteTaskByHelp, postTask } from './support/helpers';
import { TasksPage } from './support/pages/tasks';

import data from './fixtures/tasks.json'

//let para criar uma variável / const para criar constantes
let tasksPage: TasksPage 

test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
})

test.describe('Cadastro', () => {
    test('Deve poder cadastrar uma nova tarefa teclando enter', async ({ request }) => {
        const task = data.success as TaskModel
        //Todas as funções são assícronas, então tudo deve levar o await 
        //Uso do Gherkin - é usado para ilustrar um caso de teste
        await deleteTaskByHelp(request, task.name)

        await tasksPage.go()
        await tasksPage.createEnter(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('Deve poder cadastrar uma nova tarefa teclando botão', async ({ request }) => {
        const task = data.successJS as TaskModel

        await deleteTaskByHelp(request, task.name)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('Não deve deixar cadastrar tarefa duplicada', async ({ request }) => {
        const task = data.duplicate as TaskModel

        await deleteTaskByHelp(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('Campo obrigatório', async () => {
        const task = data.required as TaskModel

        await tasksPage.go()
        await tasksPage.create(task)

        //valida um texto que não é um html próprio da página buscando a propriedade do botão
        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('Atualização', () => {
    test('Deve concluir uma tarefa', async ({ request }) => {
        const task = data.Update as TaskModel

        await deleteTaskByHelp(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldbeDone(task.name)
    })
})

test.describe('Exclusão', () => {
    test('Deve excluir uma tarefa', async ({ request }) => {
        const task = data.delete as TaskModel

        await deleteTaskByHelp(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.remove(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})

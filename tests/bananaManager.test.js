import { createBananaManager } from '../src/bananaManager.js';

describe('BananaManager', () => {
    let bananaManager;

    beforeEach(() => {
        bananaManager = createBananaManager();
    });

    describe('addBanana', () => {
        test('должен добавлять новый банан с правильными полями', () => {
            const banana = {
                description: 'Желтый банан',
                assignee: 'Иван',
                ripeness: 'спелый'
            };

            bananaManager.addBanana(banana);
            const bananas = bananaManager.getAllBananas();

            expect(bananas.length).toBe(1);
            expect(bananas[0].description).toBe('Желтый банан');
            expect(bananas[0].assignee).toBe('Иван');
            expect(bananas[0].ripeness).toBe('спелый');
            expect(bananas[0].status).toBe('unpeeled');
            expect(bananas[0].id).toBeDefined();
        });

        test('должен использовать предоставленный статус', () => {
            const banana = {
                description: 'Зеленый банан',
                assignee: 'Петр',
                status: 'peeled'
            };

            bananaManager.addBanana(banana);
            const bananas = bananaManager.getAllBananas();

            expect(bananas[0].status).toBe('peeled');
        });

        test('должен выбрасывать ошибку при отсутствии обязательных полей', () => {
            const invalidBananas = [
                undefined,
                {},
                { description: 'Банан без исполнителя' },
                { assignee: 'Исполнитель без описания' }
            ];

            invalidBananas.forEach(invalidBanana => {
                expect(() => bananaManager.addBanana(invalidBanana)).toThrow('Некорректные данные банана');
            });
        });
    });

    describe('removeBanana', () => {
        test('должен удалять банан по ID', () => {
            const banana1 = { description: 'Банан 1', assignee: 'Иван' };
            const banana2 = { description: 'Банан 2', assignee: 'Мария' };

            bananaManager.addBanana(banana1);
            bananaManager.addBanana(banana2);

            let bananasBefore = bananaManager.getAllBananas();
            console.log('До удаления:', bananasBefore);

            const idToRemove = bananasBefore[0].id;
            bananaManager.removeBanana(idToRemove);

            let bananasAfter = bananaManager.getAllBananas();
            console.log('После удаления:', bananasAfter);

            expect(bananasAfter.length).toBe(bananasBefore.length - 1);
            expect(bananasAfter.some(b => b.id === idToRemove)).toBe(false);
        });

        test('ничего не делает, если ID не найден', () => {
            bananaManager.addBanana({ description: 'Банан', assignee: 'Павел' });

            bananaManager.removeBanana(12345);

            expect(bananaManager.getAllBananas().length).toBe(1);
        });
    });

    describe('updateBananaStatus', () => {
        let bananaId;

        beforeEach(() => {
            bananaManager.addBanana({ description: 'Тестовый банан', assignee: 'Тестер' });
            bananaId = bananaManager.getAllBananas()[0].id;
        });

        test('должен обновлять статус банана', () => {
            bananaManager.updateBananaStatus(bananaId, 'peeled');

            const updatedBanana = bananaManager.getAllBananas()[0];
            expect(updatedBanana.status).toBe('peeled');
        });

        test('должен выбрасывать ошибку при некорректном статусе', () => {
            expect(() => {
                bananaManager.updateBananaStatus(bananaId, 'invalid_status');
            }).toThrow('Некорректный статус');
        });

        test('не изменяет статус, если ID не найден', () => {
            bananaManager.updateBananaStatus(99999, 'peeled');

            const banana = bananaManager.getAllBananas()[0];
            expect(banana.status).toBe('unpeeled');
        });
    });

    describe('getBananasByAssignee', () => {
        beforeEach(() => {
            bananaManager.addBanana({ description: 'Банан Ивана', assignee: 'Иван' });
            bananaManager.addBanana({ description: 'Первый банан Марии', assignee: 'Мария' });
            bananaManager.addBanana({ description: 'Второй банан Марии', assignee: 'Мария' });
        });

        test('должен возвращать бананы определенного исполнителя', () => {
            const mariasBananas = bananaManager.getBananasByAssignee('Мария');

            expect(mariasBananas.length).toBe(2);
            expect(mariasBananas[0].assignee).toBe('Мария');
            expect(mariasBananas[1].assignee).toBe('Мария');
        });

        test('должен возвращать пустой массив, если исполнитель не найден', () => {
            const nonExistingBananas = bananaManager.getBananasByAssignee('Неизвестный');

            expect(nonExistingBananas.length).toBe(0);
        });
    });

    describe('getBananasByStatus', () => {
        beforeEach(() => {
            bananaManager.addBanana({ description: 'Неочищенный банан', assignee: 'Иван' });
            bananaManager.addBanana({ description: 'Очищенный банан 1', assignee: 'Мария', status: 'peeled' });
            bananaManager.addBanana({ description: 'Очищенный банан 2', assignee: 'Павел', status: 'peeled' });
            bananaManager.addBanana({ description: 'Съеденный банан', assignee: 'Алексей', status: 'eaten' });
        });

        test('должен возвращать бананы с определенным статусом', () => {
            const peeledBananas = bananaManager.getBananasByStatus('peeled');

            expect(peeledBananas.length).toBe(2);
            expect(peeledBananas[0].status).toBe('peeled');
            expect(peeledBananas[1].status).toBe('peeled');
        });

        test('должен возвращать пустой массив, если бананов с указанным статусом нет', () => {
            // Очистим список бананов
            const bananas = bananaManager.getAllBananas();
            bananas.forEach(b => bananaManager.removeBanana(b.id));

            const emptyResult = bananaManager.getBananasByStatus('unpeeled');
            expect(emptyResult.length).toBe(0);
        });
    });

    describe('getBananasByRipeness', () => {
        beforeEach(() => {
            bananaManager.addBanana({ description: 'Спелый банан 1', assignee: 'Иван', ripeness: 'ripe' });
            bananaManager.addBanana({ description: 'Спелый банан 2', assignee: 'Мария', ripeness: 'ripe' });
            bananaManager.addBanana({ description: 'Неспелый банан', assignee: 'Павел', ripeness: 'unripe' });
        });

        test('должен возвращать бананы с определенной степенью спелости', () => {
            const ripeBananas = bananaManager.getBananasByRipeness('ripe');

            expect(ripeBananas.length).toBe(2);
            expect(ripeBananas[0].ripeness).toBe('ripe');
            expect(ripeBananas[1].ripeness).toBe('ripe');
        });

        test('должен возвращать пустой массив, если бананов с указанной спелостью нет', () => {
            const overripeBananas = bananaManager.getBananasByRipeness('overripe');

            expect(overripeBananas.length).toBe(0);
        });
    });

    describe('getAllBananas', () => {
        test('должен возвращать все бананы', () => {
            bananaManager.addBanana({ description: 'Банан 1', assignee: 'Иван' });
            bananaManager.addBanana({ description: 'Банан 2', assignee: 'Мария' });

            const allBananas = bananaManager.getAllBananas();

            expect(allBananas.length).toBe(2);
        });

        test('должен возвращать пустой массив, если бананов нет', () => {
            const emptyBananas = bananaManager.getAllBananas();

            expect(emptyBananas.length).toBe(0);
        });
    });
});
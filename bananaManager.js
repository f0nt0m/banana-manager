// Фабрика для создания менеджера бананов
export const createBananaManager = () => {
  // Хранилище бананов
  let bananas = [];

  // Добавление нового банана
  const addBanana = (banana) => {
    // Проверка наличия обязательных полей
    if (!banana || !banana.description || !banana.assignee) {
      throw new Error('Некорректные данные банана');
    }
    // Добавление банана с уникальным ID и статусом по умолчанию
    bananas = [
      ...bananas,
      {
        ...banana,
        id: Date.now(),
        status: banana.status || 'unpeeled',
      },
    ];
  };

  // Удаление банана по ID
  const removeBanana = (id) => {
    bananas = bananas.filter((banana) => banana.id !== id);
  };

  // Обновление статуса банана
  const updateBananaStatus = (id, newStatus) => {
    // Допустимые статусы бананов
    const validStatuses = ['unpeeled', 'peeled', 'eaten'];
    // Проверка корректности нового статуса
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Некорректный статус');
    }
    // Обновление статуса банана с указанным ID
    bananas = bananas.map((banana) =>
      banana.id === id ? { ...banana, status: newStatus } : banana
    );
  };

  // Получение бананов по исполнителю
  const getBananasByAssignee = (assignee) => {
    return bananas.filter((banana) => banana.assignee === assignee);
  };

  // Получение бананов по статусу
  const getBananasByStatus = (status) => {
    return bananas.filter((banana) => banana.status === status);
  };

  // Получение бананов по спелости
  const getBananasByRipeness = (ripeness) => {
    return bananas.filter((banana) => banana.ripeness === ripeness);
  };

  // Возвращаем публичный интерфейс менеджера бананов
  return {
    addBanana,
    removeBanana,
    updateBananaStatus,
    getBananasByAssignee,
    getBananasByStatus,
    getBananasByRipeness,
    getAllBananas: () => bananas,
  };
};

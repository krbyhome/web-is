document.addEventListener("DOMContentLoaded", function() {
    const timelineData = {
        title: {
            text: {
                headline: "Опыт работы",
                text: "Где и что делал"
            }
        },
        events: [
            {
                start_date: {
                    year: "2024",
                    month: "06"
                },
                end_date: {
                    year: "2024",
                    month: "10"
                },
                text: {
                    headline: ", стажер",
                    text: "Починил синхру с внешним апи, июнь 2024 - октябрь 2024."
                }
            },
            {
                start_date: {
                    year: "2024",
                    month: "11"
                },
                end_date: {
                    year: "2025",
                    month: "05"
                },
                text: {
                    headline: "Яндекс.Поиск, разработчик",
                    text: "."
                }
            }
        ]
    };

    // timeline-embed - айди блока, в котором будет отображаться шкала
    // timelineData - объект данных для шкалы
    // scale_factor - начальный уровень масштабирования
    // language - язык интерфейса шкалы
    // duration - длительность анимации
    window.timeline = new TL.Timeline('timeline-embed', timelineData, {
        scale_factor: 1,
        language: "ru",
        duration: 900,
    });
});
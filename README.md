# О проекте
![Static Badge](https://img.shields.io/badge/python%20-%20%23000000?logo=python)
![Static Badge](https://img.shields.io/badge/django%20-%20%23000000?logo=django)
![Static Badge](https://img.shields.io/badge/postgresql%20-%20%23000000?logo=postgresql)
![Static Badge](https://img.shields.io/badge/javascipt%20-%20%23000000?logo=JavaScript)
![Static Badge](https://img.shields.io/badge/React%20-%20%23000000?logo=React)
![Static Badge](https://img.shields.io/badge/html5%20-%20%23000000?logo=HTML5)
![Static Badge](https://img.shields.io/badge/css3%20-%20%23000000?logo=CSS3&logoColor=%231572B6)
![Static Badge](https://img.shields.io/badge/SASS%20-%20%23000000?logo=SASS)
![Static Badge](https://img.shields.io/badge/NGINX%20-%20%23000000?logo=NGINX)

## Облачное хранилище

Фуллстек-приложение, реализующее основной функционал облачного хранилища:

Пользователь:
- Регистрация / авторизация;
- Загрузка / скачивание файлов;
- Возможность переименования файла на сервере, добавления к нему комментария;
- Возможность генерации внешней ссылки для файла с целью скачивания пользователями извне;

Администратор:
- Возможность просматривать хранилище каждого пользователя, доступен весь основной функционал работы с файлами;
- Возможность наделения пользователя правами администратора;
- Удаление пользователя из системы с удалением всех его файлов на сервере;

[Полное ТЗ](https://github.com/netology-code/fpy-diplom)

## Структура

```
cloud 
  ├── backend
  └── frontend 
```

[Backend реализован на Django + DRF + PostgreSQL](/backend)

### Описание backend

Переменные окружения, использующиеся для работы backend в файле по пути `cloud/backend/cloud/env.example`.

- `CLOUD_DIR='storage'` - имя директории на сервере, где будут создаваться поддиректории пользователей на основе их `username` для хранения файлов (путь`/backend/cloud/{CLOUD_DIR}`);

API:

- `api/login/` - авторизация пользователя;
- `api/session/` - проверка сессии пользователя;
- `api/csrf/` - получение CSRF-токена;
- `api/users/` - получение информации о пользователях и их файлах (доступно только для администратора);
- `api/users/registration/` - регистрация пользователя;
- `api/users/<int:pk>/` - работа с записью пользователя: Retrieve, Update, Destroy;
- `api/userfiles/<int:pk>/` - получение информации о пользователе и его файлах;
- `api/files/upload/` - загрузка файла на сервер;
- `api/files/<int:pk>/` - работа с записью файла: Retrieve, Update, Destroy;
- `api/files/<int:pk>/download/` - скачивание файла с сервера;
- `api/files/<int:pk>/generatelink/` - генерация внешней ссылки для файла;
- `f/<str:link_key>` - скачивание файла по внешней ссылке;

### Описание frontend

[Frontend реализован на React + SCSS](/frontend)

Переменные окружения, использующиеся для работы frontend лежат в файле по пути `cloud/frontend/cloud/env.example`.

Компоненты:
- `App` - основной компонент приложения, подключаемый в `main.jsx`;
- `Main` - главная страница сайта;
- `Header` - шапка сайта ;
- `AdminPanel` - панель администратора для вывода компонентов `User`;
- `Login` - форма авторизации;
- `Registration` - форма регистрации;
- `Dashboard` - дашборд для вывода компонентов `File`;
- `User` - блок основной информации о пользователе;
- `File` - блок информации о файле;
- `Uploader` - форма загрузки файла на сервер;
- `ExternalFileDownload` - страница с информацией об ошибке при скачивании по внешней ссылке;
- `Loader` - заглушка обработки сетевых запросов;
- `SystemMessage` - блок вывода информационного сообщения;

Контекст:
- `CloudContext` - основной контекст приложения;

Кастомные хуки:
- `useRequest` - универсальный хук для обработки сетевых запросов;
- `useDownloadFile` - специальный хук для обработки сетевых запросов на скачивание файлов;

Изображения:
- `images/icons` - иконки, используемые в приложении;

Утилиты:
- `getConvertedFileSize` - скрипт, конвертирующий размер из байтов;
- `getCSRFToken` - скрипт сетевого запроса для получения CSRF-токена;
- `getFilename` - скрипт, сокращающий отображаемое имя файла;
- `getStorageSize` - скрипт, для подсчёта общего веса файлов;
- `getTime` - скрипт, конвертирующий время в формат `ЧЧ:ММ ДД.ММ.ГГГ`;
- `PrivateRoutes` - вспомогательный компонент для разграничения доступа к разным частям приложения;

Для работы со стилями импользуется препроцессор `SASS`.

## Особенности реализации

В приложении реализовано копирование короткой внешней ссылки файла в буфер обмена по нажатию кнопки, <b>но работать этот функционал будет только при работе по протоколу `https`</b>. Работу функционала можно протестировать на локальном сервере.

## Развёртывание на сервере

[Пошаговая инструкция для развёртывания приложения на сервере](/deploy.md)
def get_user_directory_path(instance, filename):
    """Определяет путь к файлу при его сохранении"""
    return f'{instance.cloud_user.username}/{filename}'

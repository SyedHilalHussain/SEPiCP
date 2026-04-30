from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = "users"

    def ready(self):
        from .default_user import ensure_default_user

        ensure_default_user()

from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdmin(BasePermission):
    """
    Разрешает доступ только для администратора
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)


class IsAdminOrOwner(BasePermission):
    """
    Разрешает доступ только для администратора или владельца объекта
    """
    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user.username == obj.username) or bool(request.user and request.user.is_superuser)













# class IsOwnerOrAdmin(BasePermission):
#     pass
    # проверяет доступ на работу со всем ресурсом
    # def has_permission(self, request, view):
    #     print(self)
    #     return request.user == view.request.user

    # проверяет доступ на работу с конкретным объектом
    # def has_object_permission(self, request, view, obj):
    #     return bool(request.user and request.user == obj.user) or bool(request.user and request.user.is_staff)
    #
    #
    # def has_permission(self, request, view, obj):
    #     return bool(request.user and request.user == obj.user) or bool(request.user and request.user.is_staff)

# class CloudUserPermissions(BasePermission):
#     """
#     Allows access only to admin users.
#     """
#
#     def has_permission(self, request, view):
#         if request.user:
#             if request.user.is_superuser:
#                 return True
#             else:
#                 return bool(request.method == 'POST' and not request.user.is_authenticated)
#
#     def has_object_permission(self, request, view, obj):
#         return bool(
#             (request.user and request.user.username == obj.username and request.method in SAFE_METHODS) or
#             bool(request.user and request.user.is_superuser)
#         )
#
#
# class IsUser(BasePermission):
#     def has_object_permission(self, request, view, obj):
#         return bool(request.user and request.user == obj.user) and request.method in SAFE_METHODS
#
#
# class IsNewUser(BasePermission):
#     def has_permission(self, request, view):
#         return not request.user.is_authenticated

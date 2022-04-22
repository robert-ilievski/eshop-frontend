export const getRoleName = (roleKey) => {
    switch (roleKey) {
        case 'ROLE_ADMIN':
            return 'ADMIN';
        case 'ROLE_USER':
            return 'USER';
        case 'ROLE_POSTMAN':
            return 'POSTMAN';
        default:
            return null;
    }
}

export default {
    ADMIN: 'ROLE_ADMIN',
    USER: 'ROLE_USER',
    POSTMAN: 'ROLE_POSTMAN',
};

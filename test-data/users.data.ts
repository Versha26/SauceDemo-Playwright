export interface User {
    username: string;
    password: string;
}

const PASSWORD = 'secret_sauce';

export const users: Record<string, User> = {
    standard: { username: 'standard_user', password: PASSWORD },
    lockedOut: { username: 'locked_out_user', password: PASSWORD },
    problem: { username: 'problem_user', password: PASSWORD },
    performanceGlitch: { username: 'performance_glitch_user', password: PASSWORD },
    error: { username: 'error_user', password: PASSWORD },
    visual: { username: 'visual_user', password: PASSWORD },
};

export const invalidUsers = {
    wrongPassword: { username: 'standard_user', password: 'wrong_pass' },
    unknownUser: { username: 'invalid_user', password: PASSWORD },
    emptyUserName: { username: '', password: PASSWORD },
    emptyPassword: { username: 'standard_user', password: '' },
    bothEmpty: { username: '', password: ''},
};
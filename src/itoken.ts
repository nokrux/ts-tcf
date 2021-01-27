export interface IToken {
    resolve: Function;
    reject: Function;
    timeout: NodeJS.Timeout;
};
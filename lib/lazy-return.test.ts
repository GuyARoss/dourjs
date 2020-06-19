import lazyReturn from './lazy-return';

describe('lazy return', () => {
    it('works', () => {
        expect(lazyReturn({ cat: 'test' }, (key) => 'test')).toEqual('test')
    })
})
import numpy as np
from PrintInfo import Info
'''
x0:初始值
'''

x0 = float(input('输入初始值：\n'))

#初始函数
init_fun = lambda x: np.power(x, 3) - x - 1
#函数求导
deri_fun = lambda x: 3 * np.power(x, 2) - 1
#迭代方程
tran_fun = lambda x: x - init_fun(x) / deri_fun(x)


#迭代函数
def iterative(func=tran_fun, x0=x0, times=10):
    number = 0
    xi = x0
    while True and number < times:
        xi = func(x0)
        x0 = xi
        number += 1
    return xi


#输出
##输出个人信息
Info()


def result():
    xi = iterative()
    print('迭代结果：' + str(xi))


result()
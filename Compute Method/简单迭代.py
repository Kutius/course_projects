import numpy as np
from PrintInfo import Info
'''
x0:初始值
'''

x0 = float(input('输入初始值：\n'))

#初始函数
init_fun = lambda x: 2 * x**3 - x - 1
#迭代方程1
tran_fun_1 = lambda x: np.cbrt((x + 1) / 2)
#迭代方程2
tran_fun_2 = lambda x: 2 * np.power(x, 3) - 1


#迭代函数
def iterative(func=tran_fun_1, x0=x0, times=10):
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


def result(func):
    xi = iterative(func)
    print('迭代结果：' + str(xi))


result(tran_fun_1)
result(tran_fun_2)
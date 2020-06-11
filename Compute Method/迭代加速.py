import numpy as np
from PrintInfo import Info
'''
x0:初始值
theta:阈值
'''

x0 = float(input('输入初始值：\n'))
theta = 1e-6

#初始函数--有三个解
init_fun = lambda x: np.power(x, 3) - np.sin(x) - 12 * x + 1
#函数求导
deri_fun = lambda x: 3 * np.power(x, 2) - np.cos(x) - 12
#牛顿迭代方程
tran_fun_Newton = lambda x: x - init_fun(x) / deri_fun(x)
#简单迭代方程
tran_fun_Simple = lambda x: np.cbrt(np.sin(x) + 12 * x - 1)


#迭代函数
def iterative(func, x0=x0, theta=theta, times=100):
    number = 0
    xi = x0
    while True and number < times:
        xi = func(x0)
        if np.abs(xi - x0) < theta:
            return xi, number
        x0 = xi
        number += 1


#埃特金迭代加速
def atiken(func, x0=x0, theta=theta, times=100):
    number = 0
    while True and number < times:
        x1 = func(x0)
        x2 = func(x1)
        xi = x2 - np.power((x2 - x1), 2) / (x2 - 2 * x1 + x0)
        if np.abs(xi - x0) < theta:
            return xi, number
        x0 = xi
        number += 1


#输出
##输出个人信息
Info()


def result(func):
    xi, number = iterative(func, x0, theta)
    print('迭代次数：' + str(number))
    print('迭代结果：' + str(xi) + '\n')


print('牛顿迭代：')
result(tran_fun_Newton)
print('简单迭代：')
result(tran_fun_Simple)
print('埃特金迭代加速：')
xi, number = atiken(tran_fun_Simple)
print('迭代次数：' + str(number))
print('迭代结果：' + str(xi) + '\n')
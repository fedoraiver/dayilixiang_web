import numpy as np
import matrixutil as mr
import pandas as pd
import sys
'''
a=np.array([[45,68,21,486],[87,42,36,10],[84,76,54,62],[57,83,4,88]],dtype = 'float32')
print(a)
(l,u)=mr.lu(a,express=True)
print(b)
print(mr.son_false(a,[[1,2],[1,2]]))
print(l)
print(u)
r=np.dot(l,u)
print(r)
b=(np.array([[1,0,1,1],[0,1,1,0],[0,0,1,1]])).T
c=np.array([2,2])
print(mr.schmidt())
print(a.shape)
print(mr.schmidt(b,express=True)[1])
d=np.array([[1,2,3,4],[4,5,6,7],[6,7,8,9],[2,5,7,0]])
print(mr.eigvals(d,absolute=True))
print(mr.eigmul(d,expand=True))
a=[-2,3,0,0]
b=[1,2,1]
print(mr.mulmul(a,b))
mr.r_simpsteps(a,express=True)
mr.display(a)
'''
read_path=r'./uploads/1.csv'
write_path=r'./uploads/2.csv'
matrix=pd.read_csv(read_path,sep=',',header=None)
#'''
func_name=sys.argv[1]
express=sys.argv[2]
result=eval('mr.'+func_name)(matrix,eval(express))
result=np.round(result,decimals=4)
if len(result.shape)==0:
    result=np.full((1,1),result)
f=pd.DataFrame(data=result)
f.to_csv(write_path,index=False,header=False)
#'''

#test
'''
a=mr.inverse(matrix)
print(a)
result=np.round(a,decimals=2)
print(result)
#np.savetxt(write_path,result,delimiter=',')
f=pd.DataFrame(data=result)
f.to_csv(write_path)
'''
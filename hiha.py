n=int(input())
ans=0
for _ in range(n):
    s=input()
    for i in s:
        if(i == "+"):
            ans+=1
            break
    else:
        ans-=1
print(ans)
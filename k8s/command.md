# command





## Pod



### 创建pod



```bash
apiVersion: v1
kind: Pod
metadata:
  name: myngxpod
spec:
  containers:
  - name: ngx
    image: "nginx:1.18-alpine"
```



`kubectl apply -f myngxpod.yaml`



* 查看pod详情

```bash
kubectl  describe pod myngxpod

# IP:           10.244.1.5
# IPs:
  #  IP:  10.244.1.5
curl 10.244.1.5
> <h1>Welcome to nginx!</h1>   done!!!


kubectl logs podname # 查看日志

kubectl exec -it  podname  -- sh // 进入pod

kubectl delete pod podname // 删除 pod
```





### 创建多容器pod



```bash
apiVersion: v1
kind: Pod
metadata:
  name: myngxpod2
spec:
  containers:
  - name: ngx
    image: "nginx:1.18-alpine"
  - name: alpine
  	image: "alpine:3.12"
```



```bash
# 查看多容器pod日志
[root@xxx1 yamls]# kubectl logs myngxpod
error: a container name must be specified for pod myngxpod, choose one of: [ngx alpine]
[root@xxx1 yamls]# kubectl logs myngxpod alpine
this is second
[root@xxx1 yamls]# kubectl logs myngxpod ngx
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
...
```



```bash
# 进入多容器pod
kubectl exec -it myngxpod -c alpine -- sh
```





## 配置数据卷：挂载主机目录



```bash
apiVersion: v1
kind: Pod
metadata:
  name: myngxpod
spec:
  containers:
  - name: ngx
    image: "nginx:1.18-alpine"
    volumeMounts:
    - name: mydata
      mountPath: /data
  - name: alpine
    command: ["sh","-c","echo this is second && sleep 36000"]
    image: "alpine:3.12"
  volumes:
  - name: mydata
    hostPath: 
      path: /root/data
      type: Directory
```

volumeMounts   代表挂载

mountPath          代表要挂载的目录



* 验证

```bash
[root@z1 yamls]# kubectl exec -it myngxpod -c ngx -- sh
/ # ls
bin                   docker-entrypoint.d   home                  mnt                   root                  srv                   usr
data                  docker-entrypoint.sh  lib                   opt                   run                   sys                   var
dev                   etc                   media                 proc                  sbin                  tmp
/ # cd data/
/data # ls
log.txt
/data # cat log.txt 
123
/data # 
```





## deployment




















































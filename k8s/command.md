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





### 配置数据卷：挂载主机目录



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



### pod 和 deployment基本区别，创建deployment

Pods:



1. 运行一组容器，适合一次性开发
2. 很少直接用于生产



Deployment



1. 运行一组相同的Pod（副本水平扩展），滚动更新
2. 适合生产



总结为： Deployment 通过副本集管理和创建POD



### 创建dep



```bash
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myngxdep
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: ngx
          image: "nginx:1.18-alpine"
          imagePullPolicy: IfNotPresent

```





### 两个容器共享一个文件夹

* 这个文件夹在 虚拟机节点哪里？





关键点



```bash
volumes:
- name: sharedata
	emptyDir: {}
```



同一个pod内 的容器都能读写 EmptyDir 中文件。 常用于临时空间、 多容器共享，如日志或者 tmp 文件需要的临时目录



```bash
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myngxdep
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: ngx
          image: "nginx:1.18-alpine"
          imagePullPolicy: IfNotPresent
          volumeMounts:
            - name: sharedata
              mountPath: /data
        - name: alpine
          image: "alpine:3.12"
          imagePullPolicy: IfNotPresent
          command: ["sh", "-c", "echo this is second && sleep 36000"]
          volumeMounts:
            - name: sharedata
              mountPath: /data
      volumes:
        - name: sharedata
          emptyDir: {}

```





`kubectl exec -it myngxdep-65b9fdddf-jmz7x  -c alpine -- sh`

在两个容器里面 都能找到 /data 文件夹





## init容器的基本使用



> 有些时候，pod 之间的启动 是需要添加依赖关系的；比如a容器启动依赖b容器，如果b 容器没有启动完成，那么就没有启动a 容器的必要；



init容器是一种特殊容器，在Pod内的应用容器启动之前运行，Init容器可以包括一些应用镜像中不存在的使用工具和安装脚本；



init容器与普通的容器非常像，除了如下两点：

​	它们总是运行到完成；

​	每个都必须在下一个启动之前成功完成；



如果Pod的init 容器失败，kubelet会不断重启该init 容器直到该容器成功为止； 然而，如果Pod 对应的restartPlicy值 为“Never”, k8s不会重新启动Pod





基本配置



```bash
initContainers:
	- name: init-mydb
		image: alpine:3.12
		command: ['sh','-c','echo wait for db && sleep 35 && echo done']
```



* 具体场景

1. 譬如ping db
2. 譬如控制服务启动顺序


















































































































































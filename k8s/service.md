# services



> 提供负载均衡和服务自动发现





### ClusterIP





> clusterIP: 通过集群的内部IP暴露服务，选择该值时服务只能够在集群内部访问。这也是默认的ServiceType；





### 创建svc



```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ngx1
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
        - name: ngx1
          image: "nginx:1.18-alpine"
          imagePullPolicy: IfNotPresent
          volumeMounts: 
            - name: htmldata
              mountPath: /usr/share/nginx/html/index.html
              subPath: h1
          ports:
            - containerPort: 80
      volumes:
        - name: htmldata
          configMap: 
            defaultMode: 0644
            name: html
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 80 
  selector: # service 通过selector 和 pod建立关联；
    app: nginx
```



```bash
# kubectl get svc
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
nginx-svc    ClusterIP   10.103.245.236   <none>        80/TCP    2m44s

[root@xx1 services]# curl 10.103.245.236
this is h1
[root@xx1 services]# curl 10.103.245.236
this is h1
```

删除 svc对应的 dep，并再次创建dep时；CLUSTERip并不会改变；



### 在pod内部通过 nginx-svc访问服务



```bash
# kubectl exec -it  ngx1-bc96fffcc-swz64 -- sh
# curl nginx-svc
this is h1
/ # 
```





### svc负载均衡多个pod



```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ngx1
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
        - name: ngx1
          image: "nginx:1.18-alpine"
          imagePullPolicy: IfNotPresent
          volumeMounts: 
            - name: htmldata
              mountPath: /usr/share/nginx/html/index.html
              subPath: h1
          ports:
            - containerPort: 80
      volumes:
        - name: htmldata
          configMap: 
            defaultMode: 0644
            name: html
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ngx2
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
        - name: ngx2
          image: nginx:1.18-alpine
          imagePullPolicy: IfNotPresent
          volumeMounts:
            - name: htmldata
              mountPath: /usr/share/nginx/html/index.html
              subPath: h2
          ports:
            - containerPort: 80
      volumes:
        - name: htmldata
          configMap:
            defaultMode: 0644
            name: html
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 80 
  selector: # service 通过selector 和 pod建立关联；
    app: nginx
```



```bash
# kubectl get svc
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
nginx-svc    ClusterIP   10.99.130.169   <none>        80/TCP    9s

# curl 10.99.130.169
this is h1
[root@z1 services]# curl 10.99.130.169
this is h1
[root@z1 services]# curl 10.99.130.169
this is h1
[root@z1 services]# curl 10.99.130.169
this is h2
[root@z1 services]# curl 10.99.130.169
this is h1
[root@z1 services]# curl 10.99.130.169
this is h1
[root@z1 services]# curl 10.99.130.169
this is h2
[root@z1 services]# curl 10.99.130.169
this is h2
[root@z1 services]# 
```



### 宿主句访问 k8s的svc的基本方法



```bash
# curl nginx-svc
curl: (6) Could not resolve host: nginx-svc; Unknown error
```

Why?



* 方法

```bash
$> sudo yum install  bind-utils  -y

# 接下来下来我们执行
$> nslookup nginx-svc

# nslookup nginx-svc
Server:         183.60.83.19
Address:        183.60.83.19#53

** server can't find nginx-svc: NXDOMAIN
```



nslookup 可以通过dns来查看host 对应的ip；



`nslookup nginx-svc`



`/etc/resolv.conf`

>  用于设置DNS服务器IP地址、DNS域名和设置主机的域名搜索顺序







添加一个进去



然后执行  

```bash
nslookup nginx-svc.default.svc.cluster.local
```



* 具体做法

```bash
# kubectl get svc -n kube-system
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
kube-dns   ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP,9153/TCP   8d

# 拷贝10.96.0.10

vi /etc/resolv.conf

nameserver 10.96.0.10  # 添加此行

$> nslookpu nginx-svc.default.svc.cluster.local

# nslookup nginx-svc.default.svc.cluster.local
Server:         10.96.0.10
Address:        10.96.0.10#53

Name:   nginx-svc.default.svc.cluster.local
Address: 10.99.130.169 

10.99.130.169 正好对应的是  svc 的 集群IP

#因此

$> curl  nginx-svc.default.svc.cluster.local
this is h1

# 短链

$> cat /etc/resolv.conf

...
nameserver 183.60.82.98
search  default.svc.cluster.local  svc.cluster.local

# 现在短链就可以了

# nslookup nginx-svc
Server:         10.96.0.10
Address:        10.96.0.10#53

Name:   nginx-svc.default.svc.cluster.local
Address: 10.99.130.169

# curl nginx-svc
this is h2

```





### 无头services


























































































































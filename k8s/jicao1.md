# 概念



## namespace

> Namespace 是对一组资源和对象的抽象集合，用来将系统内部的对象划分为不同的项目组或者用户组
>
> 它根linux的namespace属于不同层面的东西；
>
> namespace常用来隔离不同的用户，比如k8s自带的服务一般运行在kube-system namespace中；而不至于和用户自有的服务混淆；





## workload

pod是所有业务类型的基础，也是k8s管理的最小单位级；

可以理解它是一个或多个容器的组合；



![image-20230607162716419](./img/01.png)





### port的四种模式



#### NodePort 

>  (On every node), 所有主机端口均可访问



在所有节点（虚拟机）上开发一个特定端口，任何发送到该端口的流量都被转发到对应的服务；

端口范围30000-32767



```md
curl 172.17.70.144:32163
# success
curl 172.17.70:145:32163
# success
```



#### HostNode 

>  (Nodes running o pad) 仅pod所在主机端口可访问







hostPort 直接将容器的端口与所调度的节点（虚拟机）上的端口进行映射

![image-20230607170733675](./img/02.png)



很类似那面这种，将容器ip和虚拟机ip映射上

```md
docker run -d --name tt\
-v /home/xxx/myweb:/app \
-w /app  \
-p 8081:80\
alpine:3.12\
./myserver
```



#### Cluster Ip 

>  (internal only)  集群内部访问













#### Layer-4 Load Balancer

> L4层负载均衡器（对接公有云负载均衡服务）







## ingress

部署两个服务，并使用负载均衡配置；



![image-20230607190328354](./img/3.png)

两个程序，在两个主机上同时存在；一模一样的目录；





xxx.com -> success



### 负载均衡 -> add Ingress



* Ingress 相当于一个7层负载均衡器，理解为进行反代并定义规则的一个api对象， 
* ingress Controller 通过监听 ingress api转化为各自的配置 （常用的有 nginx-ingress， trafik-ingress）



![image-20230607185725635](/Users/ruanhan/Library/Application Support/typora-user-images/image-20230607185725635.png)










































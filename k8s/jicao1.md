# k8s安装



适用于华为云Linux服务器，使用的操作系统是 centos7.6  . 

## 一、增加普通用户

创建用户 shenyi 。不要使用root赤裸裸操作服务器
#useradd shenyi
#passwd shenyi  (自行输入密码）

给shenyi赋予 sudo权限
#vi /etc/sudoers   编辑这个文件
 在这一行下加入
root    ALL=(ALL)       ALL (这一行是原来有的)
shenyi  ALL=(ALL)       ALL （这一行是我们要加入的)
注意：保存的时候要键入 wq!  (因为这厮是只读文件)

------接下来 请退出shell。 一律使用 shenyi 进行登录和操作，禁止随意使用root 

## 二、修改主机名：

  华为云的主机名是类似：hecs-x-xlarge-2-linux-20201101235704  ，太长了，看的恶心

```bash
#hostnamectl set-hostname  jtthink1  //当前主机名设置为  jtthink1    ,其他几台分别设置为 jtthink2 以此类推 ，不要把各个机器搞成一样
#hostnamectl set-hostname  jtthink2 
#hostnamectl set-hostname  jtthink3 
```

修改hosts文件。 sudo vi /etc/hosts .给新主机增加127.0.0.1 。不然tmd 你去ping jtthink1 显示的是局域网IP
（重新登录终端 主机名就变了）

## 三、下载docker离线安装包

### 1、禁用 firewalld

 systemctl stop firewalld && systemctl disable firewalld

### 2、禁用selinux (华为云 默认是禁用的，这步可以省略，getenforce 可以看状态。如果是开的，那么自行百度禁止掉)





2、
https://download.docker.com/linux/centos/7/x86_64/stable/Packages/
目前我下载的是 19.03 版本 https://download.docker.com/linux/centos/7/x86_64/stable/Packages/docker-ce-19.03.3-3.el7.x86_64.rpm
下载好后 上传到 服务器上 你喜欢的位置（或者直接用wget 在服务器上下载，很快很丝滑)
 我的位置是 /home/shenyi/tools/docker-ce-19.03.3-3.el7.x86_64.rpm

### 3、安装docker

 sudo yum install docker-ce-19.03.3-3.el7.x86_64.rpm -y

  耐心等待
 不出意外 会出现2个错误：
 第一个错误：
   Requires: containerd.io >= 1.2.2-3
 我们可以到这里去下载 ：https://centos.pkgs.org/7/docker-ce-stable-x86_64/containerd.io-1.2.13-3.1.el7.x86_64.rpm.html （版本比它高是可以的）
 下载下来：wget https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.13-3.2.el7.x86_64.rpm
 手工安装：
  sudo yum install -y containerd.io-1.2.13-3.2.el7.x86_64.rpm
 第二个错误： Requires: docker-ce-cli  
  于是我们 wget https://download.docker.com/linux/centos/7/x86_64/stable/Packages/docker-ce-cli-19.03.3-3.el7.x86_64.rpm
  (注意：cli工具 要和 上面下载的docker-ce版本一致)
  接下来是安装cli:sudo yum install -y docker-ce-cli-19.03.3-3.el7.x86_64.rpm

 搞定后，继续安装docker,也就是再执行一次：sudo yum install docker-ce-19.03.3-3.el7.x86_64.rpm -y



安装docker 另一种姿势



```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```



```bash
sudo yum install -y yum-utils
sudo yum-config-manager \
--add-repo \
http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```



```bash
yum install -y docker-ce-19.03.3 docker-ce-cli-19.03.3  containerd.io-1.4.6
```



## 4、设置用户组

docker安装时默认创建了docker用户组，将普通用户加入docker用户组就可以不使用sudo来操作docker

sudo usermod -aG docker  zeze (这里请把shenyi改成你的用户名)

注意：光加入还不行，要么重新登录，要么执行  newgrp - docker  (改变当前用户的有效群组)

## 5、由于使用的是 华为云，因此镜像加速器要使用华为的设置 （阿里云的镜像加速，之前课程讲过）

 帮助文档看这里：https://support.huaweicloud.com/usermanual-swr/swr_01_0045.html

#sudo mkdir -p /etc/docker     #创建一个文件夹 叫做docker

利用tee 命令把下面的配置写入 daemon.json
registry-mirrors的值请改成你们自己的地址

#sudo tee /etc/docker/daemon.json <<-'EOF'  
{
  "registry-mirrors": ["https://82m9ar63.mirror.aliyuncs.com"]   
}
EOF

## 6、启动docker 

systemctl  start docker  



```bash
强烈注意。重启docker 是两条命令：
#systemctl daemon-reload  
#systemctl restart docker  
```



## 7、尝试pull 一个镜像（反正后面要用，有用的一比)

 docker pull alpine:3.12

​                                            

## 8 , 补充





学习机master 要去掉污点 



```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```



(后面一个 – 是需要的)





**以下操作  预防装k8s或rancher有问题。(不一定有问题)**



实际操作 不要使用root。应该自己创建普通用户。需要权限用sudu 输入密码。别怕麻烦



补丁命令 切root干 .执行时 $ 别拷贝进去。

请切root 后，按顺序每台机器都要执行(注意是每台、每台、每台、每台)



systemctl stop firewalld && systemctl disable firewalld



* 关闭selinux：(都要执行)

$ sed -i 's/enforcing/disabled/' /etc/selinux/config  # 永久
$ setenforce 0  # 临时

* 关闭swap：(都要执行)

$ swapoff -a  # 临时
$ sed -ri 's/.*swap.*/#&/' /etc/fstab  # 永久

modprobe br_netfilter

$ vi /etc/sysctl.conf

加入或修改 如下4项

 net.ipv4.ip_forward = 1
 net.bridge.bridge-nf-call-ip6tables = 1
 net.bridge.bridge-nf-call-iptables = 1
 net.bridge.bridge-nf-call-arptables = 1



$sysctl -p（使之立即生效）

$iptables -P FORWARD ACCEPT



(下面两句话 都要执行 )



$systemctl daemon-reload && systemctl restart containerd  && systemctl restart docker  
$systemctl daemon-reload && systemctl restart containerd 





如果出现 Docker info（或nerdctl info ） 查看报错 WARNING: No swap limit support 
参考：https://www.cnblogs.com/yangzp/p/15672475.html





## 9 kubeadm 装 k8s







* 挂代码（使用root）

su root

```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
        https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

```



```bash
yum makecache
```





* 安装三大件

```bash
sudo yum -y install kubelet-1.18.6  kubeadm-1.18.6  kubectl-1.18.6
```

确认是否装好了



rpm -aq kubelet kubectl kubeadm



* 开机启动

sudo systemctl enable kubelet





* 每台机器上都要执行：

    systemctl enable docker.service

  使用systemd作为docker的cgroup driver

  sudo vi  /etc/docker/daemon.json   （没有则创建）
   加入
  {
    "exec-opts": ["native.cgroupdriver=systemd"]
  }



* 重启docker

  systemctl daemon-reload  && systemctl restart docker

  确保执行这句命令docker info |grep Cgroup

  出来的值是 systemd





* 初始化集群(master节点)

sudo kubeadm init --kubernetes-version=v1.18.6  --image-repository registry.aliyuncs.com/google_containers



依次执行



```
mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```



* 初始化 网络

```bash
sudo sysctl net.bridge.bridge-nf-call-iptables=1
```

```bash
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

```bash
kubectl get pods --all-namespaces
```



* 解决个坑

sudo vi /etc/kubernetes/manifests/kube-controller-manager.yaml

在command节点 加入 
- --allocate-node-cidrs=true
- --cluster-cidr=10.244.0.0/16

然后执行 systemctl restart kubelet





* 污点还没执行

  

  

  

* 学习机master 要去掉污点 

```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

(后面一个 – 是需要的)











* join集群



sudo sysctl net.bridge.bridge-nf-call-iptables=1



kubeadm join xxx



* 这里记得要把 master里面的 kubeconfig 拷贝到worker里面；

**这一步非常容易忘，俗称天坑**



```bash
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```





* 再次重启docker 和 containerD

$systemctl daemon-reload && systemctl restart containerd  && systemctl restart docker  
$systemctl daemon-reload && systemctl restart containerd 






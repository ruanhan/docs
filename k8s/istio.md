# istio



* 连接 （Connect）智能控制服务之间的调用流量，能够实现灰度升级、AB测试和红黑部署等功能；
* 安全加固 （Secure）自动为服务之间的调用提供认证、授权和加密。
* 控制 （Control）应用用户定义的policy，保证资源在消费者中公平分配。
* 观察 （Observe）查看服务运行期间的各种数据，比如日志、监控和tracing，了解服务的运行情况；





## istall



`istioctl manifest apply --set profile=demo`



```bash
# istioctl manifest apply --set profile=demo
This will install the Istio 1.13.8 demo profile with ["Istio core" "Istiod" "Ingress gateways" "Egress gateways"] components into the cluster. Proceed? (y/N) y
✔ Istio core installed                                                                                                                          
✔ Istiod installed                                                                                                                              
✔ Egress gateways installed                                                                                                                     
✔ Ingress gateways installed                                                                                                                    
✔ Installation complete                                                                                                                         Making this installation the default for injection and validation.

Thank you for installing Istio 1.13.  Please take a few minutes to tell us about your install/upgrade experience!  https://forms.gle/pzWZpAvMVBecaQ9h9
```



## start



* 创建一个命名空间

```bash
kubectl create ns myistio
```




































































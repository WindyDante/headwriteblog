---
title: 瑞吉外卖
tags:
  - 实战项目
  - 瑞吉外卖
categories:
  - 实战项目
  - 瑞吉外卖
description: SpringBoot+vue实现的瑞吉外卖项目
abbrlink: a1e1aa91
date: 2023-08-13
---


# 准备工作

- 先建数据库，建表，再创建一个`SpringBoot`的工程，勾选`Spring web`、`MySql`、`MyBatis`
- 在pom.xml文件中导入`druid`、`lombok`、`MyBatisPlus`

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.21</version>
</dependency>
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.1</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

- 删除没必要的文件

导入前端资源，放在`resources/static`目录下

如果直接放在`resources`目录下，则需要配置一下资源映射

```java
@Configuration
@Slf4j
public class WebMvcConfig extends WebMvcConfigurationSupport {
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("开始进行静态资源映射...");
        registry.addResourceHandler("/backend/**").addResourceLocations("classpath:/backend/");
        registry.addResourceHandler("/front/**").addResourceLocations("classpath:/front/");
    }
}
```

配置数据库的连接`端口`、`数据源`、`mybatisPlus驼峰映射`及日志等

```yml
server:
  # 端口
  port: 80
spring:
  # 数据连接池  
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/TakeOut?serverTimezone=Asia
    username: root
    password: zjh97867860
    type: com.alibaba.druid.pool.DruidDataSource

mybatis-plus:
  configuration:
    # 在映射实体类或者属性时，将数据库中的表名或字段名中的下划线去掉，按照驼峰命名映射
    map-underscore-to-camel-case: true
    # 日志
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  # 生成策略  
  global-config:
    db-config:
      id-type: assign_id
```



# 后台代码登录编写

## 创建对应的实体类

```java
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;


//  员工实体类
@Data
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String username;

    private String name;

    private String password;

    private String phone;

    private String sex;

    private String idNumber;    // 身份证号码

    private Integer status;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    //这两个先不用管，后面再说
    @TableField(fill = FieldFill.INSERT)
    private Long createUser;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;
}
```

## 编写mapper、service、serviceImpl、controller

`mapper`：

```java
package com.eastwind.mapper;

/*
@author zhangJH
@create 2023-07-22-21:14
*/


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.eastwind.entity.Employee;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmployeeMapper extends BaseMapper<Employee> {
}
```

`service`：

```java
package com.eastwind.service;

/*
@author zhangJH
@create 2023-07-22-21:14
*/


import com.baomidou.mybatisplus.extension.service.IService;
import com.eastwind.entity.Employee;

public interface EmployeeService extends IService<Employee> {

}
```

`serviceImpl`：

```java
package com.eastwind.service.impl;

/*
@author zhangJH
@create 2023-07-22-21:15
*/


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.Employee;
import com.eastwind.mapper.EmployeeMapper;
import com.eastwind.service.EmployeeService;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl extends ServiceImpl<EmployeeMapper, Employee> implements EmployeeService {
}
```

`controller`：

```java
package com.eastwind.controller;

/*
@author zhangJH
@create 2023-07-22-21:17
*/


import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/employee")
public class EmployeeController {
}
```



对于前后端数据交互的一个管理、需要有`data`（数据）、`msg`（返回消息）、`code`（状态码）

## 编写返回类(Result)

```java
package com.eastwind.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result<T> {
    private Integer code;  // 编码：1成功。0和其他数字失败
    private String errMsg;  // 错误信息
    private T data; // 数据
    private Map map = new HashMap();  // 动态数据

    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.code = 1;  //成功状态码
        r.data = data;
        return r;
    }

    public static <T> Result<T> error(String errMsg) {
        Result<T> r = new Result<>();
        r.errMsg = errMsg; //设置错误信息
        r.code = 0;  //默认失败状态码，后期我们可以根据自己的需求来设置其他状态码
        return r;
    }

    public Result<T> add(String msg, String value) {
        this.map.put(msg, value);
        return this;
    }
}
```

## 编写登录登出代码

在编写这一段的时候遇到了一个问题，系统报500的错误，原因是druid和MP的不兼容问题

**Error attempting to get column ‘XXX’ from result set. Cause: java.sql.**

`这是因为我的表的createtime类型为DateTime，通过mybatis-plus代码生成器生成的是LocalDateTime，而Java8里面新出来了一些API，LocalDate、LocalTime、LocalDateTime ，但是在默认的情况下，在mybatis里面不支持java8的时间、日期`

**更改javabean类中的类型，将LocalDate改为Date，实测有效**

![image-20230723100144749](https://s2.loli.net/2023/08/14/PDsCWpydLJ4n5Z9.png)

或者在数据库连接池url中添加zeroDateTimeBehavior=convertToNull

<img src="https://s2.loli.net/2023/08/14/yNBxqw18l4c62pf.png" alt="image-20230723100233190" style="zoom:50%;" />

再者就是改变版本了，druid只有在1.1.21才支持MP(3.4)的兼容

接着是编写登录登出代码

```java
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.eastwind.common.Result;
import com.eastwind.entity.Employee;
import com.eastwind.service.EmployeeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;

    @PostMapping("/login")
    // @RequestBody可以接收json字符串
    public Result<Employee> login(HttpServletRequest request, @RequestBody Employee employee) {
        // 1、对密码进行MD5加密
        String password = employee.getPassword();   // 获得密码
//        DigestUtils.md5DigestAsHex(输入流/字节数组)  所以需要将字符串转为字节
        password = DigestUtils.md5DigestAsHex(password.getBytes());     // 利用DigestUtils工具类进行加密

        // 2、查找用户是否存在(利用MP编写)
        LambdaQueryWrapper<Employee> lqw = new LambdaQueryWrapper<>();
        // Employee::getName数据库中的name数据,employee.getName()传入的name数据
        lqw.eq(Employee::getUsername,employee.getUsername());
        // 因为name设定了unique(唯一约束)，所以返回的对象唯一
        Employee emp = employeeService.getOne(lqw);

        // 3、不存在则返回登录失败msg
        if (emp == null){
            return Result.error("登录失败");
        }

        // 4、验证密码是否正确(加密后的密码与数据库内的密码比对[数据库的密码是加密过的])
        if (!(password.equals(emp.getPassword()))){
            // 如果密码相同，说明是正确的，继续往下判断，如果不同，说明密码是错误的，在这里结束
            return Result.error("登录失败");
        }

        // 5、验证员工状态，是否可用
        if (emp.getStatus() == 0){
            // 0不可用，1可用，当不可用时，则结束，否则继续往下判断
            return Result.error("账号已禁用");
        }

        System.out.println(emp.getCreateTime());

        // 6、将ID数据存到session域中传递过去
        request.getSession().setAttribute("employee",employee.getId());
        return Result.success(employee);
    }

    @PostMapping("/logout")
    public Result<String> logout(HttpServletRequest request){
        request.getSession().removeAttribute("employee");
        return Result.success("登出成功");
    }
}
```

## 完善登录功能

之前的登录功能，我们不登录也可以正常访问，这显然是不正确的，我们希望看到的是，只有**登录成功后**，才能看到登录页面，**未登录状态**跳转到登录页面。

可以使用过滤器或拦截器来对登录功能进行完善，如果你忘了Filter的知识，可以先通过大佬的这篇文章简单了解一下

`https://cyborg2077.github.io/2022/08/21/JavaWeb08/`

### 编写拦截器

新建一个`filter`包，在filter包下放置拦截器

```java
import lombok.extern.slf4j.Slf4j;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// filterName是拦截器的名字，urlPatterns是拦截路径，/*是拦截所有请求
@WebFilter(filterName = "loginCheckFilter",urlPatterns = "/*")
@Slf4j
public class LoginCheckFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        // request.getRequestURI()获取拦截路径
        log.info("拦截到路径{}",request.getRequestURI());
        filterChain.doFilter(request,response);
    }
}
```

配置完拦截器，需要在主程序运行位置添加拦截器扫描

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@Slf4j
@SpringBootApplication
@ServletComponentScan
public class TakeOutApplication {

    public static void main(String[] args) {
        SpringApplication.run(TakeOutApplication.class, args);
        log.info("项目启动成功...");
    }
}
```

启动服务器，访问页面，查看日志，现在可以拦截到URI了

```
拦截到路径/backend/index.html
拦截到路径/employee/page
拦截到路径/backend/page/login/login.html
```

#### 编写登录Filter逻辑

获取本次请求的URI，并编写不需要被拦截的URI

```java
// 获取本次请求的URI
String uri = request.getRequestURI();
log.info("拦截到路径{}",uri);

// 定义不需要被拦截的请求
String[] urls = new String[]{
        "/employee/login",
        "/employee/logout",
        "/backend/**",
        "/front/**"
};
```

`/employee/login`和`/employee/logout`是两个请求，当发送登录和登出请求时，其实是不需要拦截的

backend下的和front下的静态资源，这两个可以直接放行，因为拦截的是ajax请求，页面是没有数据的。



在urls里定义了通配符，如何让它匹配上/backend/index.html这些文件呢，就需要用到一个工具类`AntPathMatcher`

编写了一个判断请求是否需要被处理的方法，利用`AntPathMatcher`中的`match`方法来匹配

```java
// 路径匹配
public static final AntPathMatcher ANT_PATH_MATCHER = new AntPathMatcher();

// 判断该请求是否需要被处理
public boolean check(String[] urls, String uri){
    for (String url : urls) {
        boolean match = ANT_PATH_MATCHER.match(url, uri);
        // 需要被处理
        if (match) {
            return true;
        }
    }
    // 遍历完后不需要被处理
    return false;
}
```



不需要处理，直接放行

```java
boolean check = check(urls, uri);
// 不需要被处理，放行并退出
if (check) {
    log.info("路径{}不需要被处理",request.getRequestURI());
    filterChain.doFilter(request,response);
    return;
}
```



已登录，放行

```java
// 判断登录状态，如果已登录，放行
if (request.getSession().getAttribute("employee") != null){
    log.info("用户已登录");
    filterChain.doFilter(request,response);
    return;
}
```



未登录，拦截，并发送数据告知前端未登录，跳转回登录页面

```java
// 在前端页面有一个拦截器，可以拦截数据，如果数据符合条件则放行，否则重定向回登录页面
// 这个数据由我们进行发送
// 需要导入fastJson的包来发送Json字符串
log.info("用户未登录");
//未登录状态为什么要返回一个error呢？而且msg为NOTLOGIN
response.getWriter().write(JSON.toJSONString(Result.error("NOTLOGIN")));
```

我们看一下JS代码就懂了，当符合未登录状态的条件时，会自动重定向到登录页面

```js
// 响应拦截器
service.interceptors.response.use(res => {
    if (res.data.code === 0 && res.data.msg === 'NOTLOGIN') {// 返回登录页面
    console.log('---/backend/page/login/login.html---')
    localStorage.removeItem('userInfo')
    window.top.location.href = '/backend/page/login/login.html'
    } else {
    return res.data
    }
}
```

这里需要导入fastJson坐标

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.62</version>
</dependency>
```

完整代码如下（使用了@Slf4j的log日志功能）：

```java
import com.alibaba.fastjson.JSON;
import com.eastwind.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.AntPathMatcher;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// filterName是拦截器的名字，urlPatterns是拦截路径，/*是拦截所有请求
@WebFilter(filterName = "loginCheckFilter",urlPatterns = "/*")
@Slf4j
public class LoginCheckFilter implements Filter {

    // 路径匹配
    public static final AntPathMatcher ANT_PATH_MATCHER = new AntPathMatcher();

    // 判断该请求是否需要被处理
    public boolean check(String[] urls, String uri){
        for (String url : urls) {
            boolean match = ANT_PATH_MATCHER.match(url, uri);
            // 需要被处理
            if (match) {
                return true;
            }
        }
        // 遍历完后不需要被处理
        return false;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // 获取本次请求的URI
        String uri = request.getRequestURI();
        log.info("拦截到路径{}",uri);

        // 定义不需要被拦截的请求
        String[] urls = new String[]{
                "/employee/login",
                "/employee/logout",
                "/backend/**",
                "/front/**"
        };

        boolean check = check(urls, uri);
        // 不需要被处理，放行并退出
        if (check) {
            log.info("路径{}不需要被处理",request.getRequestURI());
            filterChain.doFilter(request,response);
            return;
        }

        // 判断登录状态，如果已登录，放行
        if (request.getSession().getAttribute("employee") != null){
            log.info("用户已登录");
            filterChain.doFilter(request,response);
            return;
        }

        // 在前端页面有一个拦截器，可以拦截数据，如果数据符合条件则放行，否则重定向回登录页面
        // 这个数据由我们进行发送
        // 需要导入fastJson的包来发送Json字符串
        log.info("用户未登录");
        response.getWriter().write(JSON.toJSONString(Result.error("NOTLOGIN")));

        // request.getRequestURI()获取拦截路径
//        log.info("拦截到路径{}",request.getRequestURI());

    }
}
```



#### 编写登出Filter逻辑

登出的Filter逻辑不需要更改， 在前面已经写好了

```java
@PostMapping("/logout")
public Result<String> logout(HttpServletRequest request){
    request.getSession().removeAttribute("employee");
    return Result.success("登出成功");
}
```

只需要删除之前保存的employee属性，并在前端删除登录数据就可以了

简单分析一下前端代码

```html
<div class="right-menu">
    <!--这里动态的显示登录的用户名-->
    <div class="avatar-wrapper">{{ userInfo.name }}</div>
    <!--这里就是登出的按钮-->
    <img src="images/icons/btn_close@2x.png" class="outLogin" alt="退出" @click="logout" />
</div>
```

这里是一个登出按钮，单击后触发登出方法

这是一个登出方法，触发后发送post请求，在登出方法成功结束后，删除登录数据userInfo，并跳转回登录页面

```js
logout() {
    logoutApi().then((res)=>{
        if(res.code === 1){
        localStorage.removeItem('userInfo')
        window.location.href = '/backend/page/login/login.html'
        }
    })
}
```

发送ajax请求后，触发登出方法

```js
function logoutApi(){
  return $axios({
    'url': '/employee/logout',
    'method': 'post',
  })
}
```



# 添加员工

## 流程分析

实现功能之前，先梳理一下整个流程

1. 页面发送ajax请求，将新增员工页面输入的数据以json的形式提交到服务器
2. 服务器端Controller接收页面提交的数据并调用Service将数据保存
3. Service调用Mapper操作数据库，保存数据

前端数据模型`ruleForm`

```js
ruleForm : {
    'name': '',
    'phone': '',
    'sex': '男',
    'idNumber': '',
    username: ''
}
```



提交函数，放置参数列表

<img src="https://s2.loli.net/2023/08/14/sf4VHwDF8jY5pKP.png" alt="image-20230723194504266" style="zoom: 67%;" />



发送ajax请求:post请求，请求地址/employee，携带参数params

```java
// 新增---添加员工
function addEmployee (params) {
  return $axios({
    url: '/employee',
    method: 'post',
    data: { ...params }
  })
}
```

## 具体实现

```java
@PostMapping
public Result<String> save(HttpServletRequest request,@RequestBody Employee employee){
    // 设置新密码默认为12345，并进行MD5加密
    employee.setPassword(DigestUtils.md5DigestAsHex("12345".getBytes()));

    // 设置创建时间为当前日期
    employee.setCreateTime(LocalDateTime.now());

    // 设置更新时间为当前日期
    employee.setUpdateTime(LocalDateTime.now());

    // 设置用户创建者的id(谁创建了这个用户，这个id就是谁)
    Long empId = (Long) request.getSession().getAttribute("employee");
    employee.setCreateUser(empId);

    // 设置用户更新者的id(谁更新了这个用户，这个id就是谁)
    employee.setUpdateUser(empId);

    // 保存用户信息
    employeeService.save(employee);

    return Result.success("添加员工成功");
}
```

至此添加员工的功能就开发完毕了，启动服务器，测试一下添加员工，添加完毕后，如果没有问题，会显示添加员工成功，之后去数据库查看，数据库中也有对应的数据，且密码也经过了加密，createTime和createUser等数据也都有



值得注意的一点是，username不能重复，因为在建表的时候设定了unique，只能存在唯一的username，如果存入相同的username则会报错
控制台报错`java.sql.SQLIntegrityConstraintViolationException: Duplicate entry 'Kyle' for key 'employee.idx_username'`



**统一异常处理**，如果你没啥印象了，可以看看大佬写的这篇文章第三小节

`https://cyborg2077.github.io/2022/09/10/SSMIntegration/`



## 完善全局异常处理器

在`com.eastwind.common`包下创建一个全局异常处理类`GlobalExceptionHandler`，并添加`exceptionHandler`方法用来捕获异常，并返回结果

```java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public Result<String> exceptionHandler(SQLIntegrityConstraintViolationException exception) {
        log.error(exception.getMessage());
        return Result.error("未知错误");
    }
}
```

先用日志输出一下看看能不能正常运行，这也是代码开发的一个好习惯
启动服务器，新增员工测试，输入数据库中已存在的username，这次会报错`未知错误`（如果你还没报未知错误，建议先调试好再往下进行）
控制台日志输出的错误信息为`Duplicate entry 'Kyle' for key 'employee.idx_username'`



然后我们再来开发具体的异常处理逻辑
我们希望给出的错误信息为该用户名已存在，所以我们就需要对错误信息来进行判断，如果错误信息中包含`Duplicate entry`，则说明有条目是重复的，在本案例中，只可能是username重复了，所以我们在用split()方法来对错误信息切片，取出重复的username，采用字符串拼接的方式，告知该用户已经存在了



```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;

// @RestControllerAdvice由ControllerAdvice和ResponseBody组合
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // @ExceptionHandler(被处理的异常类)
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public Result<String> exceptionHandler(SQLIntegrityConstraintViolationException ex){
        // ex.getMessage()得到具体错误信息
        log.error(ex.getMessage());
        // 如果错误信息包含Duplicate entry，说明用户名已存在，提示错误
        if (ex.getMessage().contains("Duplicate entry")){
            String[] split = ex.getMessage().split(" ");
            String msg = split[2] + "已存在";
            return Result.error(msg);
        }
        return Result.error("未知异常");
    }
}
```

接下来重启服务器，测试添加功能，输入已经存在的username，输出的错误信息符合我们的预期

![image-20230723211112431](https://s2.loli.net/2023/08/14/AxalYc2UNZnIeuo.png)



# 员工信息分页查询

1. 页面发送`ajax`请求，将分页查询参数(`page`、`pageSize`、`name`)提交到服务
2. 服务端`Controller`接收页面提交的数据并调用`Service`查询数据
3. `Service`调用`Mapper`操作数据库，查询分页数据
4. `Controller`将查询到的分页数据响应给页面
5. 页面接收到分页数据并通过`ElementUI`的`Table`组件展示到页面上

关于分页功能的实现，我们在之前的学习中也做过了，下面文章连接中的第七小节就是分页查询

`https://cyborg2077.github.io/2022/08/24/JavaWeb10/`

## 前端代码分析

![image-20230724085437993](https://s2.loli.net/2023/08/14/GPsLikCfRaKT1BM.png)

单击按钮后，会将数据通过ajax请求发送到后端

<img src="https://s2.loli.net/2023/08/14/pG6RDXmOPFbhHjd.png" alt="image-20230724085526792" style="zoom: 67%;" />

数据显示部分的代码，是由这部分代码完成的，这里在获取参数后，将参数传递到了ajax请求上

![image-20230724085643216](https://s2.loli.net/2023/08/14/H7OfXmluThIMnQL.png)

这里发送的是get请求，那么请求参数是哪里来的呢？

前端代码配置了一个`request`拦截器，拦截`get`请求，并将请求参数使用拼串的方式拼接到URL上

```js
// request拦截器
service.interceptors.request.use(config => {
// 是否需要设置 token
// const isToken = (config.headers || {}).isToken === false
// if (getToken() && !isToken) {
//   config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
// }
// get请求映射params参数
if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
    const value = config.params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && typeof(value) !== "undefined") {
        if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            url += subPart + encodeURIComponent(value[key]) + "&";
        }
        } else {
        url += part + encodeURIComponent(value) + "&";
        }
    }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
}
return config
}, error => {
    console.log(error)
    Promise.reject(error)
})
```

## 编写具体的业务逻辑

### 配置MyBatisPlus插件

新建com.eastwind.config包，并新建MyBatisPlusConfig类

```java
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 配置MyBatisPlus的分页插件
 * */
@Configuration
public class MyBatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor myBatisPlusFilterInterceptor(){
        MybatisPlusInterceptor mybatisPlusInterceptor = new MybatisPlusInterceptor();
        mybatisPlusInterceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        return mybatisPlusInterceptor;
    }

}
```

### 编写日志查看数据

```java
@GetMapping("/page")
public Result<Page> page(int page,int pageSize,String name){
    log.info("page={},pageSize={},name={}",page,pageSize,name);
    return null;
}
```

![image-20230724090133696](https://s2.loli.net/2023/08/14/lR2iBYNjWZPe4hu.png)

![image-20230724090150060](https://s2.loli.net/2023/08/14/DFRCV3JHGB5qUxd.png)

### 具体的业务逻辑

```java
@GetMapping("/page")
public Result<Page> page(int page,int pageSize,String name){
   // page:当前页码(startIndex)
    // pageSize:查询数量
    log.info("page={},pageSize={},name={}",page,pageSize,name);
    // 得到分页的构造器
    Page pageInfo = new Page(page,pageSize);

    // 添加过滤条件
    LambdaQueryWrapper<Employee> lqw = new LambdaQueryWrapper<>();
    // 如果name不为空，数据库就用like匹配外面的name字段,否则不匹配
    lqw.like(!(name == null || "".equals(name)),Employee::getName,name);

    // 对查询结果进行排序(更新时间)
    lqw.orderByDesc(Employee::getUpdateTime);

    // 执行查询
    employeeService.page(pageInfo,lqw);

    return Result.success(pageInfo);
}
```

此时查询后，得到数据

![image-20230724093936269](https://s2.loli.net/2023/08/14/jXSAERO7fWgh5sv.png)

对分页进行模糊匹配

![image-20230724094000426](https://s2.loli.net/2023/08/14/eqpDCGrlLiyTHcR.png)

此时数据都被查询成功了



# 启用/禁用员工账号

## 需求分析

1. 在员工管理列表页面，可以对某个员工账号进行启用或者禁用操作。账号禁用的员工不能登录系统，启用后的员工可以正常登录。
2. 需要注意，只有管理员（`admin`用户）可以对其他普通用户进行启用、禁用操作，所以普通用户登录系统后启用、禁用按钮不显示。
3. 管理员`admin`登录系统可以对所有员工账号进行启用、禁用操作。
4. 如果某个员工账号状态为正常，则按钮显示为“禁用”，如果员工账号状态为已禁用，则按钮显示为“启用”

![image-20230724115815564](https://s2.loli.net/2023/08/14/GetVUXW9FjCDQAc.png)

如何做到，登录的是管理员(`admin`用户)时，才能看到启用/禁用按钮呢？



当我们加载完页面的时候，获取一下当前登录账号的用户名，也就是`username`

```js
created() {
    this.init()
    this.user = JSON.parse(localStorage.getItem('userInfo')).username
}
```

随后判断一下这个用户名是不是`admin`，如果是的话就显示启用/禁用，否则不显示
那么我们现在就来button里设置一下，使用`v-if`来判断

```js
<el-button
    type="text"
    size="small"
    class="delBut non"
    @click="statusHandle(scope.row)"
    v-if="user === 'admin'"
>
    {{ scope.row.status == '1' ? '禁用' : '启用' }}
</el-button>
```



### Ajax请求发送过程

1. 页面发送`ajax`请求，将参数(`id`、`status`)提交到服务端
2. 服务端`Controller`接收页面提交的数据并调用`Service`更新数据
3. `Service`调用`Mapper`操作数据库



从禁用/启用的按钮中，我们可以看到是绑定了一个名为`statusHandle(scope.row)`函数

```html
<el-button
    type="text"
    size="small"
    class="delBut non"
    @click="statusHandle(scope.row)"
    v-if="user === 'admin'"
>
    {{ scope.row.status == '1' ? '禁用' : '启用' }}
</el-button>
```



## 编写具体业务逻辑

启用、禁用员工账号，本质上就是一个更新操作，也就是对status状态字段进行操作在Controller中创建update方法，此方法是一个通用的修改员工信息的方法
只不过现在我们的update只需要修改status，而后面我们还有修改员工其他信息的业务，根据传进来的employee

**update可以处理员工状态的代码和员工修改信息的代码**

```java
@PutMapping
public Result<String> update(HttpServletRequest request,@RequestBody Employee employee){
    Long empId = (Long) request.getSession().getAttribute("employee");
    employee.setUpdateUser(empId);
    employee.setUpdateTime(LocalDateTime.now());
    employeeService.updateById(employee);
    return Result.success("员工信息修改成功");
}
```

查看数据库，我们发现`status`并没有被修改
通过查看日志，我们发现更新操作并没有完成，这是怎么回事呢？

![image-20230724134638799](https://s2.loli.net/2023/08/14/Zpj9FvmgMLSKkiy.png)

我们发现，这里的id值不相同

问题的原因：

- **JS对Long型数据进行处理时丢失精度，导致提交的id和数据库中的id不一致。**

如何解决这个问题?

- 我们可以在服务端给页面响应json数据时进行处理，**将Long型数据统一转为String字符串**



### 配置状态转换器（JacksonObjectMapper）

```java
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;

/**
 * 对象映射器:基于jackson将Java对象转为json，或者将json转为Java对象
 * 将JSON解析为Java对象的过程称为 [从JSON反序列化Java对象]
 * 从Java对象生成JSON的过程称为 [序列化Java对象到JSON]
 */
public class JacksonObjectMapper extends ObjectMapper {

    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    public static final String DEFAULT_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String DEFAULT_TIME_FORMAT = "HH:mm:ss";

    public JacksonObjectMapper() {
        super();
        //收到未知属性时不报异常
        this.configure(FAIL_ON_UNKNOWN_PROPERTIES, false);

        //反序列化时，属性不存在的兼容处理
        this.getDeserializationConfig().withoutFeatures(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);


        SimpleModule simpleModule = new SimpleModule()
                .addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT)))
                .addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)))
                .addDeserializer(LocalTime.class, new LocalTimeDeserializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT)))

                .addSerializer(BigInteger.class, ToStringSerializer.instance)
                .addSerializer(Long.class, ToStringSerializer.instance)
                .addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT)))
                .addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)))
                .addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT)));

        //注册功能模块 例如，可以添加自定义序列化器和反序列化器
        this.registerModule(simpleModule);
    }
}
```

### 扩展Mvc框架的消息转换器

写这块代码的时候遇到一个问题，如果按照教程上的写法是继承类`WebMvcConfigurationSupport`，并重写里面的`extendMessageConverters`这个方法，但是按照这样写会出现报错

如下图所示，没有找到资源的404报错，遇到这个问题我也不太清楚，我把继承类`WebMvcConfigurationSupport`改成实现接口`WebMvcConfigurer`，并且实现了里面的`extendMessageConverters`这个方法后，就可以正常运行了

![image-20230724144531818](https://s2.loli.net/2023/08/14/HRyo82f5cpM3zrN.png)

```java
import com.eastwind.common.JacksonObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@Slf4j
public class WebMvcConfig implements WebMvcConfigurer {
// 注意，这里是实现WebMvcConfigurer，并实现extendMessageConverters方法才可以使用
    /**
     * 如果资源放在resources目录下，需要添加资源映射
     * */
//    @Override
//    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/backend/**").addResourceLocations("classpath:/backend/");
//        registry.addResourceHandler("/front/**").addResourceLocations("classpath:/front/");
//    }


    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter messageConverter = new MappingJackson2HttpMessageConverter();
        // 设置对象转化器，底层使用jackson将Java对象转为json
        messageConverter.setObjectMapper(new JacksonObjectMapper());
        // 将上面的消息转化器追加到mvc框架的转化器集合中，(index=0,表示在第一个设置，避免被其他转换器接收，从而达不到想要的功能)
        converters.add(0,messageConverter);
    }
}
```

### 测试

启动服务器，尝试禁用按钮
数据库中的status字段数据发生了改变，且页面上也显示已禁用，再次点击启用，也能正常操作

![image-20230724145052786](https://s2.loli.net/2023/08/14/iNkojJYHuSP2rWp.png)



# 编辑员工信息

## 流程分析

1. 点击编辑按钮时，页面将跳转到`add.html`，并在url中携带参数`员工id`
2. 在`add.html`页面中获取url中的参数`员工id`
3. 发送`ajax`请求，请求服务端，同时提交`员工id`参数
4. 服务端接受请求，并根据`员工id`查询员工信息，并将员工信息以`json`形式响应给页面
5. 页面接收服务端响应的`json`数据，并通过Vue的`双向绑定`进行员工信息回显
6. 点击保存按钮，发送ajax请求，将页面中的员工信息以json形式提交给服务端
7. 服务端接受员工信息，并进行处理，完成后给页面响应
8. 页面接收到服务端响应信息后进行相应处理

## 具体实现

add.html如下

![image-20230724150121475](https://s2.loli.net/2023/08/14/WCsZtqH7JQp9VdS.png)

点击编辑按钮后，页面会跳转到add.html，并在url中携带参数员工id

注意:add.html是公共页面，新建员工和编辑员工都是在此页面进行操作

编辑按钮绑定的事件为addMemberHandle

```html
<el-button
    type="text"
    size="small"
    class="blueBug"
    @click="addMemberHandle(scope.row.id)"
    :class="{notAdmin:user !== 'admin'}"
>
    编辑
</el-button>
```

在`add.html`页面中获取url中的参数`员工id`，判断是添加员工还是修改员工

```js
addMemberHandle (st) {
    if (st === 'add'){
        window.parent.menuHandle({
        id: '2',
        url: '/backend/page/member/add.html',
        name: '添加员工'
        },true)
    } else {
        window.parent.menuHandle({
        id: '2',
        url: '/backend/page/member/add.html?id='+st,
        name: '修改员工'
        },true)
    }
}
```

服务端接受请求，并根据`员工id`查询员工信息，并将员工信息以`json`形式响应给页面

```js
created() {
    this.id = requestUrlParam('id')
    this.actionType = this.id ? 'edit' : 'add'
    if (this.id) {
    this.init()
    }
}
```

add.html加载完毕之后，调用钩子函数，主要看其中`requestUrlParam`函数,它传递了一个id进去，然后进行一个id数据的获取，requestUrlParam方法写了url地址参数的获取

首先是得到了整个地址

然后对地址进行获取，从?后面一位开始取，并对&符号进行分割

什么意思呢？举个例子：`http://localhost/backend/page/member/add.html?id=1683100374560436226`

例如这一段代码，从?后面开始取，就是得到数据`id=1683100374560436226`如果后面跟着其他的属性啥的

比如说`http://localhost/backend/page/member/add.html?id=1683100374560436226&name=zhangsan`

此时会得到`id=1683100374560436226&name=zhangsan`，再对它进行分割

["id=1683100374560436226","name=zhangsan"]

然后遍历数据，loc是在每个数据里面进行查询(indexOf)，查询前缀为(id=xxx)的数据，这里的id是argname传递进来的

如果查到了，就!=-1，并且对id=这个进行替换，替换为空字符串，再对?进行替换，替换为空字符串，也就是说，收集到的id必然是一串**数字**，否则没查到就是-1，返回空字符串，

```js
//获取url地址上面的参数
function requestUrlParam(argname){
  var url = location.href
  var arrStr = url.substring(url.indexOf("?")+1).split("&")
  for(var i =0;i<arrStr.length;i++)
  {
      var loc = arrStr[i].indexOf(argname+"=")
      if(loc!=-1){
          return arrStr[i].replace(argname+"=","").replace("?","")
      }
  }
  return ""
}
```

页面接收服务端响应的`json`数据，并通过Vue的`双向绑定`进行员工信息回显
在`created`钩子函数中还调用了`init`函数
该函数接收到服务端响应的`json`数据之后，先判断一下状态码，如果是1，则说明是操作成功
随后将获取到的数据赋给表单，从而达到回显数据的效果

```js
async init () {
    queryEmployeeById(this.id).then(res => {
        console.log(res)
        if (String(res.code) === '1') {
        console.log(res.data)
        this.ruleForm = res.data
        this.ruleForm.sex = res.data.sex === '0' ? '女' : '男'
        // this.ruleForm.password = ''
        } else {
        this.$message.error(res.msg || '操作失败')
        }
    })
}
```

当数据回显后，单击保存按钮会发送put请求让服务器端更新数据

```js
// 修改---添加员工
function editEmployee (params) {
  return $axios({
    url: '/employee',
    method: 'put',
    data: { ...params }
  })
}
```

服务端接受员工信息，并进行处理，完成后给页面响应
由于修改员工信息也是发送的`PUT`请求，与之前启用/禁用员工账号是一致的，而且前面我们已经写过了PUT请求的`Controller`层
所以当我们点击保存按钮时，调用`submitForm`函数，而在`submitForm`函数中我们又调用了`editEmployee`函数，发送`PUT`请求，实现修改功能

```java
@PutMapping
public Result<String> update(HttpServletRequest request,@RequestBody Employee employee){
    log.info(employee.toString());
    Long empId = (Long) request.getSession().getAttribute("employee");
    employee.setUpdateUser(empId);
    employee.setUpdateTime(LocalDateTime.now());
    employeeService.updateById(employee);
    return Result.success("员工信息修改成功");
}
```

页面接收到服务端响应信息后进行相应处理
员工信息修改成功之后，调用了`goBack`函数，跳转至员工管理页面，并发起分页请求`list`

```js
goBack(){
    window.parent.menuHandle({
        id: '2',
        url: '/backend/page/member/list.html',
        name: '员工管理'
    },false)
}
```

至此，编辑员工信息的功能就完成了



# 公共字段自动填充

## 问题分析

- 前面我们已经完成了对员工数据的添加与修改，在添加/修改员工数据的时候，都需要指定一下创建人、创建时间、修改人、修改时间等字段，而这些字段又属于公共字段，不仅员工表有这些字段，在菜品表、分类表等其他表中，也拥有这些字段。
- 那我们有没有办法让这些字段在一个地方统一管理呢？这样可以简化我们的开发
	- 答案就是使用`MybatisPlus`给我们提供的公共字段自动填充功能



## 代码实现

### 实现步骤

1、在实体类的属性上加入@TableField注解，指定填充策略

```java
@TableField(fill = FieldFill.INSERT)    // 插入时填充
private LocalDateTime createTime;

@TableField(fill = FieldFill.INSERT_UPDATE)     // 插入或更新时填充
private LocalDateTime updateTime;

@TableField(fill = FieldFill.INSERT) // 插入时填充
private Long createUser;

@TableField(fill = FieldFill.INSERT_UPDATE) // 插入或更新时填充
private Long updateUser;
```

里面是四种情况，分别是`DEFAULT`、`INSERT`、`UPDATE`、`INSERT_UPDATE`

这是个枚举类
`DEFAULT`为默认值，表示不填充
`INSERT`表示插入时填充
`UPDATE`表示修改时填充
`INSERT_UPDATE`表示插入和修改时填充

<img src="https://s2.loli.net/2023/08/14/JcsjlPgNWODrGCQ.png" alt="image-20230725082012852" style="zoom:67%;" />

按照框架要求编写元数据对象处理器，在此类中统一对公共字段赋值，此类需要实现`MetaObjectHandler`接口
实现接口之后，重写两个方法，一个是**插入时**填充，一个是**修改时**填充
关于字段填充方式，使用`metaObject`的`setValue`来实现
关于id的获取，我们之前是存到`session`里的，但在`MyMetaObjectHandler`类中不能获得`HttpSession`对象，所以我们需要用其他方式来获取登录用户`Id`

### ThreadLocal获取Id

- 现在存在一个问题，如何获取当前登录用户的id值
	- 我们可以使用`ThreadLocal`来解决这个问题
- 在学习ThreadLocal之前，我们需要先确认一个事情，就是客户端发送的每次http请求，对应的在服务端都会分配一个新的线程来处理，在处理过程中涉及到下面类中的方法都属于相同的一个线程:
	1. `LocalCheekFilter`中的`doFilter`方法
	2. `EmployeeController`中的`update`方法
	3. `MyMetaObjectHandler`中的`updateFill`方法

现在我们在这三个方法中添加日志输出测试

`Thread.currentThread().getId();`获取当前线程id

- doFilter

```java
@Override
public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

    //强转
    HttpServletRequest request = (HttpServletRequest) servletRequest;
    HttpServletResponse response = (HttpServletResponse) servletResponse;

    //1.获取本次请求的URI
    String requestURI = request.getRequestURI();
    log.info("拦截到请求：{}", requestURI);

    //定义不需要处理的请求
    String[] urls = new String[]{
            "/employee/login",
            "/employee/logout",
            "/backend/**",
            "/front/**"
    };

    //2.判断本次请求是否需要处理
    boolean check = check(urls, requestURI);

    //3.如果不需要处理，则直接放行
    if (check) {
        log.info("本次请求：{}，不需要处理", requestURI);
        filterChain.doFilter(request, response);
        return;
    }

    //4.判断登录状态，如果已登录，则直接放行
    if (request.getSession().getAttribute("employee") != null) {
        log.info("用户已登录，id为{}", request.getSession().getAttribute("employee"));
        //在这里获取一下线程id
        long id = Thread.currentThread().getId();
        log.info("doFilter的线程id为：{}", id);
        filterChain.doFilter(request, response);
        return;
    }

    //5.如果未登录则返回未登录结果,通过输出流方式向客户端页面响应数据
    log.info("用户未登录");
    log.info("用户id{}", request.getSession().getAttribute("employee"));
    response.getWriter().write(JSON.toJSONString(Result.error("NOTLOGIN")));

}
```

- update

```java
@PutMapping
public Result<String> update(@RequestBody Employee employee, HttpServletRequest request) {
    log.info(employee.toString());
    //获取线程id
    long id = Thread.currentThread().getId();
    log.info("update的线程id为：{}", id);
    employeeService.updateById(employee);
    return Result.success("员工信息修改成功");
}
```

- updateFill

```java
@Override
public void updateFill(MetaObject metaObject) {
    log.info("公共字段自动填充(update)...");
    log.info(metaObject.toString());
    long id = Thread.currentThread().getId();
    log.info("updateFill的线程id为：{}", id);
    metaObject.setValue("createTime", LocalDateTime.now());
    metaObject.setValue("updateTime", LocalDateTime.now());
    metaObject.setValue("updateUser", new Long(1));
    metaObject.setValue("createUser", new Long(1));
}
```

重新启动服务器，登录页面并编辑员工信息（什么都不需要动），随后点击保存，随后查看日志输出信息

> com.blog.filter.LoginCheckFilter         : doFilter的线程id为：34
> com.blog.controller.EmployeeController   : update的线程id为：34
> com.blog.common.MyMetaObjectHandler      : updateFill的线程id为：34

发现这三者确实是在同一个线程中

那么什么是`ThreadLocal`?

- `ThreadLocal`并不是一个`Thread`，而是`Thread`的局部变量
- 当使用`ThreadLocal`维护变量时，`ThreadLocal`为每个使用该变量的线程提供独立的变量副本
- 所以每一个线程都可以独立地改变自己的副本，而不会影响其它线程所对应的副本
- `ThreadLocal`为每个线程提供单独一份存储空间，具有线程隔离的效果，只有在线程内才能获取到对应的值，线程外则不能访问。

总结来说：`ThreadLocal`可以获取当前线程的值，并保存起来，在当前线程运行时，你也可以在其他地方获取它的值。



ThreadLocal常用方法:

- `public void set(T value)` 设置当前线程的线程局部变量的值
- `public T get()` 返回当前线程所对应的线程局部变量的值

那么我们如何用ThreadLocal来解决我们上述的问题呢？

- 我们可以在`LoginCheckFilter`的`doFilter`方法中获取当前登录用户id，并调用`ThreadLocal`的`set`方法来设置当前线程的线程局部变量的值（用户id)，然后在`MyMetaObjectHandler`的`updateFill`方法中调用`ThreadLocal`的`get`方法来获得当前线程所对应的线程局部变量的值（用户id)。

具体实现

- 在com.blog.common包下新建BaseContext类
- 作用：基于ThreadLocal的封装工具类，用于保护和获取当前用户id

```java
/**
 * 基于ThreadLocal的工具类
 * */
public class BaseContext {
    private static ThreadLocal<Long> threadLocal = new ThreadLocal<Long>();

    // 设置id
    public static void setCurrentId(Long id){
        threadLocal.set(id);
    }

    // 获取id
    public static Long getCurrentId(){
        return threadLocal.get();
    }
}
```

随后在`LoginCheckFilterInterceptor`类中获取id

为什么在这里获取id呢，因为当用户已经登录之后，id是存储在session域中的，所以这时候获取很方便

```java
// 判断登录状态，如果已登录，放行
if (request.getSession().getAttribute("employee") != null){
    log.info("用户已登录");

    // 根据session获取我们存的id值
    Long empId = (Long) request.getSession().getAttribute("employee");
    BaseContext.setCurrentId(empId);

    filterChain.doFilter(request,response);
    return;
}
```

设置`employee`的`id`到`session`域中，这是在登录的时候做的，详情可见如下代码倒数第三行

```java
@PostMapping("/login")
    // @RequestBody可以接收json字符串
    public Result<Employee> login(HttpServletRequest request, @RequestBody Employee employee) {
        // 1、对密码进行MD5加密
        String password = employee.getPassword();   // 获得密码
//        DigestUtils.md5DigestAsHex(输入流/字节数组)  所以需要将字符串转为字节
        password = DigestUtils.md5DigestAsHex(password.getBytes());     // 利用DigestUtils工具类进行加密

        // 2、查找用户是否存在(利用MP编写)
        LambdaQueryWrapper<Employee> lqw = new LambdaQueryWrapper<>();
        // Employee::getName数据库中的name数据,employee.getName()传入的name数据
        lqw.eq(Employee::getUsername,employee.getUsername());
        // 因为name设定了unique(唯一约束)，所以返回的对象唯一
        Employee emp = employeeService.getOne(lqw);

        // 3、不存在则返回登录失败msg
        if (emp == null){
            return Result.error("登录失败");
        }

        // 4、验证密码是否正确(加密后的密码与数据库内的密码比对[数据库的密码是加密过的])
        if (!(password.equals(emp.getPassword()))){
            // 如果密码相同，说明是正确的，继续往下判断，如果不同，说明密码是错误的，在这里结束
            return Result.error("登录失败");
        }

        // 5、验证员工状态，是否可用
        if (emp.getStatus() == 0){
            // 0不可用，1可用，当不可用时，则结束，否则继续往下判断
            return Result.error("账号已禁用");
        }


        // 6、将ID数据存到session域中传递过去
        request.getSession().setAttribute("employee",emp.getId());
        return Result.success(emp);
    }
```

在`MyMetaObjectHandler`类中，添加设置`id`的代码

```java
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


/**
 *元数据对象处理器用于解决公共字段数据统一处理的问题
 * */
@Component
@Slf4j
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        log.info("公共字段自动填充(insert)");
        log.info(metaObject.toString());
        metaObject.setValue("createTime", LocalDateTime.now());
        metaObject.setValue("updateTime", LocalDateTime.now());
        metaObject.setValue("createUser",BaseContext.getCurrentId());
        metaObject.setValue("updateUser",BaseContext.getCurrentId());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        log.info("公共字段自动填充(update)");
        log.info(metaObject.toString());
        metaObject.setValue("updateTime", LocalDateTime.now());
        metaObject.setValue("updateUser",BaseContext.getCurrentId());
    }
}
```

重新启动服务器，并登录一个非管理员账户，然后进行添加用户操作，观察数据库中的`updateUser`是否符合预期

在验证之后发现，符合预期

至此，公共字段填充功能，我们就完成了



# 新增菜品分类

## 需求分析

- 后台系统中可以管理分类信息，分类包括两种类型，分别是菜品分类和套餐分类
- 当我们在后台系统中添加菜品时，需要选择一个菜品分类
- 当我们在后台系统中天啊及一个套餐时，需要选择一个套餐分类
- 在移动端也会按照菜品分类和套餐分类来战士对应的菜品和套餐

可以在后台系统的分类管理页面分别添加菜品分类和套餐分类，如下

![image-20230725102555844](https://s2.loli.net/2023/08/14/wKTbYry3sEvl4iu.png)

新增菜品分类表单

![image-20230725102613006](https://s2.loli.net/2023/08/14/12YzgbPGfqthyQr.png)

新增套餐分类表单

![image-20230725102629432](https://s2.loli.net/2023/08/14/Uo9MRndCc7XarVf.png)

### 数据模型

简单浏览一下category表中的数据

|    Field    |    Type     | Collation | Null | Key  | Default |          Comment           |
| :---------: | :---------: | :-------: | :--: | :--: | :-----: | :------------------------: |
|     id      |   bigint    |  (NULL)   |  NO  | PRI  | (NULL)  |            主键            |
|    type     |     int     |  (NULL)   | YES  |      |         | 类型 1 菜品分类 2 套餐分类 |
|    name     | varchar(64) | utf8_bin  |  NO  | UNI  | (NULL)  |          分类名称          |
|    sort     |     int     |  (NULL)   |  NO  |      |    0    |            顺序            |
| create_time |  datetime   |  (NULL)   |  NO  |      | (NULL)  |          创建时间          |
| update_time |  datetime   |  (NULL)   |  NO  |      | (NULL)  |          更新时间          |
| create_user |   bigint    |  (NULL)   |  NO  |      | (NULL)  |           创建人           |
| update_user |   bigint    |  (NULL)   |  NO  |      | (NULL)  |           修改人           |

id是主键，name分类名称是unique唯一的，type为1表示菜品分类，type为2表示套餐分类

### 准备工作

在开发业务之前，先将需要用到的类和接口的基本结构先创建好

1、实体类**Category**，对应上表来创建
菜品分类也有`createUser`和`createTime`等字段，也可以用上面的公共字段自动填充

```java
@Data
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;


    //类型 1 菜品分类 2 套餐分类
    private Integer type;


    //分类名称
    private String name;


    //顺序
    private Integer sort;


    //创建时间
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;


    //更新时间
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;


    //创建人
    @TableField(fill = FieldFill.INSERT)
    private Long createUser;


    //修改人
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;

}
```

2、Mapper接口**CategoryMapper**
跟之前的EmployeeMapper没有本质上的区别

```java
@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
}
```

3、业务层接口**CategoryService**

```java
public interface CategoryService extends IService<Category> {
}
```

4、业务层实现类**CategoryServiceImpl**

```java
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {
}
```

5、控制层**CategoryController**

```java
@Slf4j
@RestController
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

}
```



## 流程分析

1. 页面发送ajax请求，将新增分类窗口输入的数据以json形式提交给服务端
2. 服务端Controller接收页面提交的数据并调用Service将数据存储到数据库
3. Service调用Mapper操作数据库，保存数据

我们先尝试监测一下前端给我们提供的是什么请求，以及会提交什么数据，打开开发者工具，监测NetWork，点击新增`菜品分类`表单的确定按钮

- 请求方式

	请求网址: `http://localhost/category`

	请求方法: `POST`

- json数据

	{name: “川菜”, type: “1”, sort: “10”}

点击新增`套餐分类`表单的确定按钮

- 请求方式

	请求网址: `http://localhost/category`
	请求方法: `POST`

- json数据

	{name: “好吃的套餐”, type: “2”, sort: “10”}

新增菜品分类和新增套餐分类请求的`服务端地址`和提交的`json数据`结构`相同`，所以服务端只需要提供一个方法统一处理即可



## 代码实现

服务端只需要将接收到的`json`数据添加到数据库中，并响应一个成功的提示信息

```java
@PostMapping
public Result<String> save(@RequestBody Category category) {
    log.info("category:{}", category);
    categoryService.save(category);
    return Result.success("新增分类成功");
}
```

但通过查看前端代码，发现显示的信息在前端**写死了**，只要最后的状态码是**成功状态码**

则均显示`分类添加成功！`

```js
if (res.code === 1) {
    this.$message.success('分类添加成功！')
```

如果我们想要添加菜品和添加套餐显示不同的响应结果，可以按照如下方式修改代码

前端代码

```js
if (res.code === 1) {
    this.$message.success(res.data)
```

后端代码

```java
return Result.success(category.getType() == 1 ? "添加菜品分类成功！" : "添加套餐分类成功！");
```

值得注意的一点是：当初建表的时候`name`是`unique`唯一的，如果我们尝试存入**相同的**菜品名称，则**会报错**，提示信息大概就是有字段名重复了，跟我们前面写过的全局异常处理器要处理的操作一样，所以会帮我们处理这个异常



# 分类信息分页查询

与之前的员工信息分页查询类似	

## 流程分析

按照惯例，我们还是先来分析一下流程

1. 页面发送Ajax请求，将分页查询的参数（page、pageSize）提交到服务端
2. 服务端Controller接受到页面提交的数据之后，调用Service进行查询
3. Service调用Mapper操作数据库，查询分页数据
4. Controller将查询到的分页数据响应给页面
5. 页面接收分页数据，并通过ElementUI的Table组件战士到页面上

## 代码实现

在CategorYController类中编写page方法

这里传递的参数是地址上携带的参数，所以不需要`@Pathvariable`或者`@RequestBody`

```java
@GetMapping("/page")
public Result<Page> page(int page, int pageSize) {
    //分页构造器
    Page<Category> pageInfo = new Page<>(page, pageSize);
    //条件查询器
    LambdaQueryWrapper<Category> queryWrapper = new LambdaQueryWrapper<>();
    //添加排序条件
    queryWrapper.orderByDesc(Category::getSort);
    //分页查询
    categoryService.page(pageInfo, queryWrapper);
    return Result.success(pageInfo);
}
```

重新启动服务器，查看一下效果

![image-20230725140007517](https://s2.loli.net/2023/08/14/OYgpVxRsziUD74J.png)

## 前端代码分析

页面加载完毕之后调用created钩子函数
钩子函数内又调用的是init进行初始化

```js
created() {
    this.init()
}
```

```js
async init () {
    await getCategoryPage({'page': this.page, 'pageSize': this.pageSize}).then(res => {
        if (String(res.code) === '1') {
        //将服务端查询到的数据赋给tableData，然后就能看到了
        this.tableData = res.data.records
        this.counts = Number(res.data.total)
        } else {
        this.$message.error(res.msg || '操作失败')
        }
    }).catch(err => {
        this.$message.error('请求出错了：' + err)
    })
}
```

发送的请求是get请求，请求参数值为`this.page`和`this.pageSize`，默认值分别为1和10

```js
// 查询列表接口
const getCategoryPage = (params) => {
  return $axios({
    url: '/category/page',
    method: 'get',
    params
  })
}
```



# 删除分类

## 需求分析

- 在分类管理列表页面，可以对某个分类进行删除操作
- 需要注意的是：当分类关联了菜品或者套餐时，此分类将不允许被删除



## 流程分析

按照惯例，继续分析一遍流程

1. 页面发送ajax请求，将参数(id)提交给服务端
2. 服务端Controller接收页面提交的数据，并调用Service删除数据
3. Service调用Mapper操作数据库



## 代码初步实现

在CategoryController类上添加delete方法

```java
@PutMapping
public Result<String> delete(Long id){
    return Result.success("分类信息删除成功");
}
```



## 前端代码分析

删除按钮绑定了`deleteHandle`函数

```html
<el-button
    type="text"
    size="small"
    class="delBut non"
    @click="deleteHandle(scope.row.id)"
>
    删除
</el-button>
```

这里给了一个提示信息防止误操作
然后使用`deleCategory`函数发送delete请求
若服务端返回的状态为`success`，则状态码为1，删除成功
否则删除失败

```js
deleteHandle(id) {
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
    }).then(() => {
        deleCategory(id).then(res => {
        if (res.code === 1) {
            this.$message.success('删除成功！')
            this.handleQuery()
        } else {
            this.$message.error(res.msg || '操作失败')
        }
        }).catch(err => {
        this.$message.error('请求出错了：' + err)
        })
    })
}
```

**deleCategory方法**：

```js
// 删除当前列的接口
const deleCategory = (id) => {
  return $axios({
    url: '/category',
    method: 'delete',
    params: {id}
  })
}
```

## 功能测试

![image-20230725150144560](https://s2.loli.net/2023/08/14/msb6yEkre39CYL2.png)

## 代码功能完善

当菜品分类或套餐分类关联了其他菜品或套餐时，该分类将不允许被删除

- 那么我们如何实现这个功能呢？
	- 其实也很简单，我们只需要在删除的时候，拿着当前分类的id值，去对应的菜品/套餐表中进行查询，如果能查询到数据，则说明该分类关联了菜品，不允许被删除，否则则可以删除

那么明确了思路之后，我们就来写代码

- 首先我们需要根据数据表创建菜品和套餐对应的模型类以及对应的Mapper和Service方法

**Dish(菜品)**

```java
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 菜品
 */
@Data
public class Dish implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;


    //菜品名称
    private String name;


    //菜品分类id
    private Long categoryId;


    //菜品价格
    private BigDecimal price;


    //商品码
    private String code;


    //图片
    private String image;


    //描述信息
    private String description;


    //0 停售 1 起售
    private Integer status;


    //顺序
    private Integer sort;


    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;


    @TableField(fill = FieldFill.INSERT)
    private Long createUser;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;

}
```

**Setmeal(套餐)**

```java
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 套餐
 */
@Data
public class Setmeal implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;


    //分类id
    private Long categoryId;


    //套餐名称
    private String name;


    //套餐价格
    private BigDecimal price;


    //状态 0:停用 1:启用
    private Integer status;


    //编码
    private String code;


    //描述信息
    private String description;


    //图片
    private String image;


    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;


    @TableField(fill = FieldFill.INSERT)
    private Long createUser;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;

}
```

**DishMapper**

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.eastwind.entity.Dish;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DishMapper extends BaseMapper<Dish> {
}
```

**SetmealMapper**

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.eastwind.entity.Setmeal;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SetmealMapper extends BaseMapper<Setmeal> {
}
```

**DishService**

```java
import com.baomidou.mybatisplus.extension.service.IService;
import com.eastwind.entity.Dish;

public interface DishService extends IService<Dish> {
}
```

**SetMealService**

```java
import com.baomidou.mybatisplus.extension.service.IService;
import com.eastwind.entity.Setmeal;

public interface SetMealService extends IService<Setmeal> {
}
```

**DishServiceImpl**

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.Dish;
import com.eastwind.mapper.DishMapper;
import com.eastwind.service.DishService;
import org.springframework.stereotype.Service;

@Service
public class DishServiceImpl extends ServiceImpl<DishMapper, Dish> implements DishService {
}
```

**SetMealService**

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.Setmeal;
import com.eastwind.mapper.SetmealMapper;
import org.springframework.stereotype.Service;

@Service
public class SetMealService extends ServiceImpl<SetmealMapper, Setmeal> implements com.eastwind.service.SetMealService {
}
```

在common包下新增`CustomException`类
该类用于封装我们的自定义异常

```java
public class CustomException extends RuntimeException{
    public CustomException(String msg){
        super(msg);
    }
}
```

在我们的全局异常处理器类中，使用`exceptionHandler`处理`CustomerException`异常

```java
@ExceptionHandler(CustomException.class)
public Result<String> exceptionHandler(CustomException ex){
    log.info(ex.getMessage());  // 得到错误信息
    return Result.error(ex.getMessage());
}
```

在CategoryService接口中自己写一个`delete`方法

在CategoryServiceImpl中来写具体业务逻辑
我们需要在删除数据之前，根据`id`值，去`Dish`表和`Setmeal`表中查询是否关联了数据
如果存在关联数据，则不能删除，并抛一个异常
如果不存在关联数据（也就是查询到的数据条数为0），正常删除即可

```java
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.common.CustomException;
import com.eastwind.entity.Category;
import com.eastwind.entity.Dish;
import com.eastwind.entity.Setmeal;
import com.eastwind.mapper.CategoryMapper;
import com.eastwind.service.CategoryService;
import com.eastwind.service.DishService;
import com.eastwind.service.SetMealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {
    @Autowired
    DishService dishService;

    @Autowired
    SetMealService setMealService;

    @Override
    public void delete(Long id) {
        LambdaQueryWrapper<Dish> dishLambdaQueryWrapper = new LambdaQueryWrapper<>();
        dishLambdaQueryWrapper.eq(Dish::getCategoryId,id);
        int disCount = dishService.count(dishLambdaQueryWrapper);
        if (disCount > 0){
            throw new CustomException("当前分类下关联了菜品，不能删除");
        }

        LambdaQueryWrapper<Setmeal> setmealLambdaQueryWrapper = new LambdaQueryWrapper<>();
        setmealLambdaQueryWrapper.eq(Setmeal::getCategoryId,id);
        int setmealCount = setMealService.count(setmealLambdaQueryWrapper);
        if (setmealCount > 0){
            throw new CustomException("当前分类下关联了套餐，不能删除");
        }

        // 如果没有找到关联的，就正常删除
        super.removeById(id);
    }
}
```

最后记得在`controller`中调用我们新写的`delete`方法

```java
@DeleteMapping
public Result<String> delete(@RequestParam Long ids){
    // delete方法是我们自己写的更新后的，目的是为了对菜品和套餐关联的产品做一个保护
    categoryService.delete(ids);
    return Result.success("分类信息删除成功");
}
```

![image-20230725182504491](https://s2.loli.net/2023/08/14/2Xt7EPi4DHLswor.png)

# 修改分类

## 需求分析

在分类管理列表页面点击修改按钮，弹出修改窗口，在修改窗口回显分类信息并进行修改，最后点击确定按钮完成修改操作![image-20230725140612683](https://s2.loli.net/2023/08/14/MJOxkhWiGHZlSr1.png)

## 回显效果

修改按钮绑定了一个`editHandle`函数，并传入了当前行数据

```html
<el-button
    type="text"
    size="small"
    class="blueBug"
    @click="editHandle(scope.row)"
>
    修改
</el-button>
```

那我们再来看看这个`editHandle`函数做了什么
将当前行的数据赋给了classData下的`name`和`sort`属性

```js
editHandle(dat) {
    this.classData.title = '修改分类'
    this.action = 'edit'
    this.classData.name = dat.name
    this.classData.sort = dat.sort
    this.classData.id = dat.id
    this.classData.dialogVisible = true
}
```

表单中又使用v-model实现双向绑定，这样就实现了数据回显

```html
<el-form
    class="demo-form-inline"
    label-width="100px"
    >
    <el-form-item label="分类名称：">
        <el-input
        v-model="classData.name"
        placeholder="请输入分类名称"
        maxlength="14"
        />
    </el-form-item>
    <el-form-item label="排序：">
        <el-input v-model="classData.sort"  type="number" placeholder="请输入排序" />
    </el-form-item>
</el-form>
```

## 代码开发

修改操作是发送PUT请求

```js
// 修改接口
const editCategory = (params) => {
  return $axios({
    url: '/category',
    method: 'put',
    data: { ...params }
  })
}
```

```java
@PutMapping
public Result<String> update(@RequestBody Category category) {
    log.info("修改分类信息为：{}", category);
    categoryService.updateById(category);
    return Result.success("修改分类信息成功");
}
```



# 文件上传与下载

## 文件上传简介

- 文件上传，也叫upload，是指将本地图片、视频、音频等文件上传到服务器中，可以供其他用户浏览或下载的过程
- 文件上传时，对页面的form表单有如下要求：
	1. `method="post"`，采用post方式提交数据
	2. `enctype="multipart/form-data"`，采用multipart格式上传文件
	3. `type="file"`，使用input的file控件上传

目前一些前端组件库也提供了相应的上传组件，但是底层原理还是基于form表单的文件上传，这里我们就用提供好的组件就行了
我们把这段代码放在`backend/page/demo`目录下，命名为`upload.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件上传</title>
    <!-- 引入样式 -->
    <link rel="stylesheet" href="../../plugins/element-ui/index.css" />
    <link rel="stylesheet" href="../../styles/common.css" />
    <link rel="stylesheet" href="../../styles/page.css" />
</head>
<body>
<div class="addBrand-container" id="food-add-app">
    <div class="container">
        <el-upload class="avatar-uploader"
                   action="/common/upload"
                   :show-file-list="false"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeUpload"
                   ref="upload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar"></img>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</div>
<!-- 开发环境版本，包含了有帮助的命令行警告 -->
<script src="../../plugins/vue/vue.js"></script>
<!-- 引入组件库 -->
<script src="../../plugins/element-ui/index.js"></script>
<!-- 引入axios -->
<script src="../../plugins/axios/axios.min.js"></script>
<script src="../../js/index.js"></script>
<script>
    new Vue({
        el: '#food-add-app',
        data() {
            return {
                imageUrl: ''
            }
        },
        methods: {
            handleAvatarSuccess (response, file, fileList) {
                this.imageUrl = `/common/download?name=${response.data}`
            },
            beforeUpload (file) {
                if(file){
                    const suffix = file.name.split('.')[1]
                    const size = file.size / 1024 / 1024 < 2
                    if(['png','jpeg','jpg'].indexOf(suffix) < 0){
                        this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
                        this.$refs.upload.clearFiles()
                        return false
                    }
                    if(!size){
                        this.$message.error('上传文件大小不能超过 2MB!')
                        return false
                    }
                    return file
                }
            }
        }
    })
</script>
</body>
</html>
```

服务端要接收客户端页面上传的文件，通常都会使用Apache的两个组件:

- `commons-fileupload`
- `commons-io`

Spring框架在spring-web包中对文件上传进行了封装，大大简化了服务端代码，我们只需要在Controller的方法中声明一个MultipartFile类型的参数即可接收上传的文件，例如

```java
import com.eastwind.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequestMapping("/common")
public class CommonController {

    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file){
        // 输出文件
        log.info(file.toString());
        return null;
    }
}
```

写完这段代码之后，报了一个错误：**The field file exceeds its maximum permitted size of 1048576 bytes**
 原因是因为`SpringBoot`内嵌`tomcat`默认所能上传的文件大小为**1M**,超出这个就会报错。

解决方法：

配置application.yml文件(把文件大小更新至30MB，再次上传，发现没有问题了)

```yml
server:
  # 端口
  port: 80
spring:
  # 数据连接池
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:13306/db_takeout?zeroDateTimeBehavior=convertToNull
    username: root
    password: zjh97867860
    type: com.alibaba.druid.pool.DruidDataSource
  servlet:
    multipart:
      max-file-size: 30MB
      max-request-size: 30MB
      enabled: true

mybatis-plus:
  configuration:
    # 在映射实体类或者属性时，将数据库中的表名或字段名中的下划线去掉，按照驼峰命名映射
    map-underscore-to-camel-case: true
    # 日志
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  # 生成策略
  global-config:
    db-config:
      id-type: assign_id
```

启动服务器，登陆之后访问`http://localhost/backend/page/demo/upload.html` ，看看日志信息会不会输出获取文件：……

`org.springframework.web.multipart.support.StandardMultipartHttpServletRequest$StandardMultipartFile@4274086d`

## 文件下载简介

- 文件下载，也称为了download，是指将文件从服务器传输到本地计算机的过程

- 通过浏览器进行文件下载，通常有两种表现形式

	1. 以附件形式下载，弹出保存对话框，将文件保存到指定磁盘目录
	2. 直接在浏览器中打开

- 通过浏览器进行文件下载，本质上就是服务端将文件以流的形式写回浏览器的过程

	

	在编写代码之前，我们先来设置一下**拦截路径**，将common设置为不拦截，这样文件上传和下载的请求就都不会被拦截了。

```java
// 定义不需要被拦截的请求
String[] urls = new String[]{
        "/employee/login",
        "/employee/logout",
        "/backend/**",
        "/front/**",
        "/common/**"
};
```

随后将我们上传的临时文件**转存**到指定位置

```java
import com.eastwind.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@Slf4j
@RequestMapping("/common")
public class CommonController {

    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file){
        // 输出文件
        log.info(file.toString());

        // 设置文件转存
        try {
            file.transferTo(new File("D:\\test.jpg"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return null;
    }
}
```

此时，我们上传一张图片，去D盘查看，如果没有，就是代码写错了

文件转存的位置改为动态可配置的，通过配置文件的方式指定，我们在`application.yml`文件中加入以下内容

```yml
# 配置动态文件生成路径
takeout:
  path: D:\\takeout\\img\\
```

- 使用 @Value(“${reggie.path}”)读取到配置文件中的动态转存位置
- 使用uuid方式重新生成文件名，避免文件名重复造成文件覆盖
- 通过获取原文件名来截取文件后缀
- 注意事项：我们需要先判断一下文件目录是否存在，如果不存在则先创建
- 最后的返回值是将我们生成的新文件名返回给前端

```java
import com.eastwind.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/common")
public class CommonController {

    @Value("${takeout.path}")
    private String basePath;

    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file){
        // 输出文件
        log.info(file.toString());

        // 判断路径是否存在
        File dir = new File(basePath);
        if(!dir.exists()){
            // 如果不存在
            dir.mkdirs();
        }

        // 获取传入的原文件名
        String originalFilename = file.getOriginalFilename();
        // 获取文件后缀
        String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        // 为了防止出现重复的文件名，我们需要使用UUID
        String fileName = UUID.randomUUID() + suffix;

        // 设置文件转存
        try {
            file.transferTo(new File(basePath + fileName));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return Result.success(fileName);
    }
}
```

## 文件下载代码的实现

前端页面的ElementUI的upload组件会在上传完图片后，触发img组件发送请求，服务端以流的方式（输出流）将文件写回给浏览器，在浏览器中展示图片

```html
<el-upload class="avatar-uploader"
        action="/common/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeUpload"
        ref="upload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar"></img>
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
```

定义前端发送回显图片请求的地址
通过这个url我们可以看出，请求路径为`/common/download`，且发送的是GET请求

```js
handleAvatarSuccess (response, file, fileList) {
    this.imageUrl = `/common/download?name=${response.data}`
}
```

### 后端处理

在`CommonController`类中添加`download`方法

1. 通过输入流读取文件内容
2. 通过输出流将文件写回浏览器，在浏览器展示图片
3. 关闭输入输出流，释放资源

```java
@GetMapping("download")
public void download(String name, HttpServletResponse httpServletResponse) {
    FileInputStream fileInputStream = null;
    ServletOutputStream outputStream = null;
    try {
        // 输入流，通过输入流读取文件内容
        fileInputStream = new FileInputStream(basePath + name);
        // 响应输出流，将数据输出到响应头是哪个
        outputStream = httpServletResponse.getOutputStream();
        // 响应类型是一个image
        httpServletResponse.setContentType("image/jpeg");
        int len;
        byte[] bytes = new byte[1024];
        // 每次读取1024个字节，并输出到响应头中
        while ((len = fileInputStream.read(bytes)) != -1){
            outputStream.write(bytes, 0, len);
            // 刷新流
            outputStream.flush();
        }
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        try {
            if (fileInputStream != null) {
                fileInputStream.close();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
            if (outputStream != null) {
                outputStream.close();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

这时候我们启动服务器测试一下

<img src="https://s2.loli.net/2023/08/14/wrpx9DX41vNAnUW.png" alt="image-20230726153714577" style="zoom: 25%;" />

此时就发现，数据已经成功的回显到了页面上



# 新增菜品

## 需求分析

1. 后台系统中可以管理菜品信息，通过新增功能来添加一个新的菜品
2. 在添加菜品时需要选择当前菜品所属的菜品分类，并且需要上传当前的菜品图片
3. 在移动端会按照菜品分类来展示对应的菜品信息（前端的活儿，跟咱没啥太大关系）

![image-20230727081341190](https://s2.loli.net/2023/08/14/WAwbEdiSCPLeJ3M.png)

## 数据模型

Dish表(菜品表)

is_deleted是逻辑删除，关于逻辑删除，可以回看大佬这篇MP的`https://cyborg2077.github.io/2022/09/20/MyBatisPlus/`

DML编程控制

|    Field    |     Type      | Collation | Null | Key  | Default |    Comment    |
| :---------: | :-----------: | :-------: | :--: | :--: | :-----: | :-----------: |
|     id      |    bigint     |  (NULL)   |  NO  | PRI  | (NULL)  |     主键      |
|    name     |  varchar(64)  | utf8_bin  |  NO  | UNI  | (NULL)  |   菜品名称    |
| category_id |    bigint     |  (NULL)   |  NO  |      | (NULL)  |  菜品分类id   |
|    price    | decimal(10,2) |  (NULL)   | YES  |      | (NULL)  |   菜品价格    |
|    code     |  varchar(64)  | utf8_bin  |  NO  |      | (NULL)  |    商品码     |
|    image    | varchar(200)  | utf8_bin  |  NO  |      | (NULL)  |     图片      |
| description | varchar(400)  | utf8_bin  | YES  |      | (NULL)  |   描述信息    |
|   status    |      int      |  (NULL)   |  NO  |      |    1    | 0 停售 1 起售 |
|    sort     |      int      |  (NULL)   |  NO  |      |    0    |     顺序      |
| create_time |   datetime    |  (NULL)   |  NO  |      | (NULL)  |   创建时间    |
| update_time |   datetime    |  (NULL)   |  NO  |      | (NULL)  |   更新时间    |
| create_user |    bigint     |  (NULL)   |  NO  |      | (NULL)  |    创建人     |
| update_user |    bigint     |  (NULL)   |  NO  |      | (NULL)  |    修改人     |
| is_deleted  |      int      |  (NULL)   |  NO  |      |    0    |   是否删除    |

dish_flavor表(菜品口味表)

|    Field    |     Type     | Collation | Null | Key  | Default |   Comment    |
| :---------: | :----------: | :-------: | :--: | :--: | :-----: | :----------: |
|     id      |    bigint    |  (NULL)   |  NO  | PRI  | (NULL)  |     主键     |
|   dish_id   |    bigint    |  (NULL)   |  NO  |      | (NULL)  |     菜品     |
|    name     | varchar(64)  | utf8_bin  |  NO  |      | (NULL)  |   口味名称   |
|    value    | varchar(500) | utf8_bin  | YES  |      | (NULL)  | 口味数据list |
| create_time |   datetime   |  (NULL)   |  NO  |      | (NULL)  |   创建时间   |
| update_time |   datetime   |  (NULL)   |  NO  |      | (NULL)  |   更新时间   |
| create_user |    bigint    |  (NULL)   |  NO  |      | (NULL)  |    创建人    |
| update_user |    bigint    |  (NULL)   |  NO  |      | (NULL)  |    修改人    |
| is_deleted  |     int      |  (NULL)   |  NO  |      |    0    |   是否删除   |

![image-20230727081936844](https://s2.loli.net/2023/08/14/NhxRV32JzsdG6B8.png)

我们先创建对应的实体类Dish和DishFlavor

Dish

```java
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 菜品
 */
@Data
public class Dish implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;


    //菜品名称
    private String name;


    //菜品分类id
    private Long categoryId;


    //菜品价格
    private BigDecimal price;


    //商品码
    private String code;


    //图片
    private String image;


    //描述信息
    private String description;


    //0 停售 1 起售
    private Integer status;


    //顺序
    private Integer sort;


    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;


    @TableField(fill = FieldFill.INSERT)
    private Long createUser;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;

}
```

DishFlavor

```java
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 菜品口味
 */
@Data
public class DishFlavor implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;


    //菜品id
    private Long dishId;


    //口味名称
    private String name;


    //口味数据list
    private String value;


    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;


    @TableField(fill = FieldFill.INSERT)
    private Long createUser;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;


    //是否删除
    private Integer isDeleted;

}
```

这里的实体类都是对应的数据库中的内容，没什么好说的

然后编写对应的Mapper、Service、Controller

在前面已经写过了Dish对应的Mapper、Service了，这里就不再写了，格式都是一成不变的

DisFlavorMapper

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.eastwind.entity.DishFlavor;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DisFlavorMapper extends BaseMapper<DishFlavor> {
}
```

DisFlavorService

```java
import com.baomidou.mybatisplus.extension.service.IService;
import com.eastwind.entity.DishFlavor;

public interface DisFlavorService extends IService<DishFlavor> {
}
```

DisFlavorServiceImpl

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.DishFlavor;
import com.eastwind.mapper.DisFlavorMapper;
import com.eastwind.service.DisFlavorService;
import org.springframework.stereotype.Service;

@Service
public class DisFlavorServiceImpl extends ServiceImpl<DisFlavorMapper, DishFlavor> implements DisFlavorService {
}
```



然后编写DishController类

为什么只写一个DishController类呢，这两个可以放在一起处理，一个Dish(菜品)，一个DisFlavor(菜品口味)

这两个可以放在一起处理，因为在一个地方

```java
import com.eastwind.service.DisFlavorService;
import com.eastwind.service.DishService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * 菜品管理
 * */
@RestController
@RequestMapping("/dish")
@Slf4j
public class DishController {
    @Autowired
    private DishService dishService;

    @Autowired
    private DisFlavorService disFlavorService;


}
```

## 梳理交互过程

按照惯例，在开发代码之前，我们先来梳理一下整个流程

1. 页面（backend/page/food/add.html）发送ajax请求，请求服务端获取菜品分类数据并展示到下拉框中
2. 页面发送请求进行图片上传，请求服务端将图片保存到服务器
3. 页面发送请求进行图片下载，并回显上传的图片
4. 点击保存按钮，发送ajax请求，将菜品相关数据以json形式提交到服务端

所以开发新增菜品功能，其实就是在服务端编写代码去处理前端发送的这4次请求即可



## 查询分类数据

前端分析

在页面加载完成后，执行以下几个方法

```js
created() {
    this.getDishList()
    // 口味临时数据
    this.getFlavorListHand()
    this.id = requestUrlParam('id')
    // 根据id确定是新增还是修改
    this.actionType = this.id ? 'edit' : 'add'
    if (this.id) {
    this.init()
    }
}
```

getDishList

根据响应状态码来判断操作是否成功，成功则将返回的数据赋给dishList，将获取到的菜品分类数据展示到下拉框中

```js
getDishList () {
    getCategoryList({ 'type': 1 }).then(res => {
        if (res.code === 1) {
        this.dishList = res.data
        } else {
        this.$message.error(res.msg || '操作失败')
        }
    })
}
```

getCategoryList(回显数据)

发送get请求，路径为`/category/list`

```js
// 获取菜品分类列表
const getCategoryList = (params) => {
  return $axios({
    url: '/category/list',
    method: 'get',
    params
  })
}
```

使用`v-for`遍历获取到的dishList

```html
<el-select
    v-model="ruleForm.categoryId"
    placeholder="请选择菜品分类"
>
    <el-option v-for="(item,index) in dishList" :key="index" :label="item.name" :value="item.id" />
</el-select>
```

在`CategoryController`类中，添加list方法
我们只需要发送get请求，将数据返回给前端即可，操作很简单

```java
@GetMapping("/list")
    public Result<List<Category>> list(Category category){
        // 条件构造器
        LambdaQueryWrapper<Category> queryWrapper = new LambdaQueryWrapper<>();
        // 当传入的category的对象类型不为空时，就用数据库中的Category的类型与category进行类型比较
        // 得到相同的数据
        queryWrapper.eq(category.getType() != null,Category::getType,category.getType());
        // 添加排序条件，先按照sort的大小升序排序，再按照更新时间降序排序
        queryWrapper.orderByAsc(Category::getSort).orderByDesc(Category::getUpdateTime);
        List<Category> list = categoryService.list(queryWrapper);
        return Result.success(list);
    }
```

这时候我们开一下服务器，发现数据就已经出现了

<img src="https://s2.loli.net/2023/08/14/WJFRmIHLKCdQylG.png" alt="image-20230727100009138" style="zoom:50%;" />

## 接收与回显图片

刚刚这个功能，在12章的文件上传与下载已经说过了，只需要直接使用即可

<img src="https://s2.loli.net/2023/08/14/yas1pZ7obSItCqT.png" alt="image-20230727100107523" style="zoom:50%;" />

数据在提交到服务器后是这样的

```json
{name: "啊", price: 32100, code: "", image: "1eefc77c-12b6-4cd0-8e6e-347d8f92ae84.jpg",…}
categoryId:"1397844263642378242"
code:""
description:"好吃的彩虹"
flavors:[{name: "甜味", value: "["无糖","少糖","半糖","多糖","全糖"]", showOption: false},…]
0:{name: "甜味", value: "["无糖","少糖","半糖","多糖","全糖"]", showOption: false}
1:{name: "温度", value: "["热饮","常温","去冰","少冰","多冰"]", showOption: false}
image:"1eefc77c-12b6-4cd0-8e6e-347d8f92ae84.jpg"
name:"啊"
price:32100
status:1
```

价格在前端已被处理，在点击提交按钮后，先执行前端的submitForm方法，并将price做相应的处理（在页面中单位为元，在数据库中存储的单位为分，处理的时候将原有价格乘上了100），再通过ajax请求向后端提供相应的json数据。

```js
submitForm(formName, st) {
    this.$refs[formName].validate((valid) => {
        if (valid) {
        let params = {...this.ruleForm}
        // params.flavors = this.dishFlavors
        params.status = this.ruleForm ? 1 : 0
        params.price *= 100
        params.categoryId = this.ruleForm.categoryId
        params.flavors = this.dishFlavors.map(obj => ({ ...obj, value: JSON.stringify(obj.value) }))
        delete params.dishFlavors
        if(!this.imageUrl){
            this.$message.error('请上传菜品图片')
            return 
        }
        if (this.actionType == 'add') {
            delete params.id
            addDish(params).then(res => {
            if (res.code === 1) {
                this.$message.success('菜品添加成功！')
                if (!st) {
                this.goBack()
                } else {
                this.dishFlavors = []
                // this.dishFlavorsData = []
                this.imageUrl = ''
                this.ruleForm = {
                    'name': '',
                    'id': '',
                    'price': '',
                    'code': '',
                    'image': '',
                    'description': '',
                    'dishFlavors': [],
                    'status': true,
                    categoryId: ''
                }
                }
            } else {
                this.$message.error(res.msg || '操作失败')
            }
            }).catch(err => {
            this.$message.error('请求出错了：' + err)
            })
        } else {
            delete params.updateTime
            editDish(params).then(res => {
            if (res.code === 1) {
                this.$message.success('菜品修改成功！')
                this.goBack()
            } else {
                this.$message.error(res.msg || '操作失败')
            }
            }).catch(err => {
            this.$message.error('请求出错了：' + err)
            })
        }
        } else {
        return false
        }
    })
}
```

因为Dish实体类不满足接收flavor参数，即需要导入DishDto，用于封装页面提交的数据

DTO，全称为`Data Transfer Object`，即数据传输对象，一般用于展示层与服务层之间的数据传输。

这个DTO里面用来封装Dish的数据，并加以使用

```java
@Data
public class DishDto extends Dish {

    private List<DishFlavor> flavors = new ArrayList<>();

    //后面这两条属性暂时没用，这里只需要用第一条属性
    private String categoryName;

    private Integer copies;
}
```

在`DishController`类中添加`save`方法，重启服务器，断点调试一下看看是否封装好了数据

```java
@PostMapping
public Result<String> save(@RequestBody DishDto dishDto) {
    dishService.saveWithFlavor(dishDto);
    return Result.success("新增菜品成功");
}
```

此时我们发现，`DishFlavor`中的`dishId`为`null`

但是我们需要对DishFlavor中的dishId进行赋值
所以我们要取出dishDto的dishId，然后对每一组flavor的dishId赋值

大致上就是**先将菜品数据保存到菜品表，再把菜品数据中的菜品口味得到，保存到菜品口味表，而菜品口味表有对应的菜品表id，这个id需要我们自己从菜品数据里面获取，获取之后，再对每一组的口味的菜品id进行赋值即可**

- 这里进行一下小结，我们需要做的有以下几点
	- 将菜品数据保存到`dish`表
	- 将菜品口味数据保存到`dish_flavor`表
		- 但是`dish_flavor`表中需要一个`dishId`字段值，这个字段值需要我们从`dishDto`中获取
		- 获取方式为：取出`dishDto`的`dishId`，对每一组`flavor`的`dishId`赋值
- 梳理完毕之后，那么我们就在`DishFlavorService`中编写一个`saveWithFlavor`方法

DishService

```java
public interface DishService extends IService<Dish> {
    void saveWithFlavor(DishDto dishDto);
}
```

DishServiceImpl

由于涉及到了多张表之间的操作，为了安全起见，需要在`saveWithFlavor`上面加入事务注解`@Transactional`

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.Dish;
import com.eastwind.entity.DishDto;
import com.eastwind.entity.DishFlavor;
import com.eastwind.mapper.DishMapper;
import com.eastwind.service.DisFlavorService;
import com.eastwind.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DishServiceImpl extends ServiceImpl<DishMapper, Dish> implements DishService {
    @Autowired
    private DisFlavorService dishFlavorService;
    
    @Override
    @Transactional
    public void saveWithFlavor(DishDto dishDto) {
        //将菜品数据保存到dish表
        this.save(dishDto);
        //获取dishId
        Long dishId = dishDto.getId();
        //将获取到的dishId赋值给dishFlavor的dishId属性
        List<DishFlavor> flavors = dishDto.getFlavors();
        for (DishFlavor dishFlavor : flavors) {
            dishFlavor.setDishId(dishId);
        }
        //同时将菜品口味数据保存到dish_flavor表
        dishFlavorService.saveBatch(flavors);
    }
}
```

并在main方法中，开启事务

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Slf4j
@SpringBootApplication
@ServletComponentScan
@EnableTransactionManagement
public class TakeOutApplication {

    public static void main(String[] args) {
        SpringApplication.run(TakeOutApplication.class, args);
        log.info("项目启动成功...");
    }

}
```

重启服务器，测试功能



# 菜品信息分页查询

## 需求分析

- 系统中的菜品数据很多的时候，如果在一个页面中全部展示出来会显得比较乱，不便于查看
- 所以一般的系统中都会以分页的方式来展示列表数据。
- 其中图片列和菜品分类列比较特殊
	- 图片列：会用到文件的下载功能
	- 菜品分类列：由于我们的菜品表只保存了category_id，所以我们需要查询category_id对应的菜品分类名称，从而回显数据

![image-20230727172423207](https://s2.loli.net/2023/08/14/sNgnkdlbM1whe57.png)

## 梳理交互过程

按照惯例，我们还是先来梳理一遍流程

1. 页面(backend/page/food/list.html)发送ajax请求，将分页查询参数(`page`、`pageSize`、`name`)，提交到服务端，获取分页数据
2. 页面发送请求，请求服务端进行图片下载，用于页面图片展示

那么开发菜品信息分页查询功能，其实就是在服务端编写代码去处理前端页面发送的这2次请求即可

## 代码开发

在`DishController`下添加`page`方法，进行分页查询

```java
@GetMapping("/page")
public Result<Page> page(int page, int pageSize, String name) {
    //构造分页构造器对象
    Page<Dish> pageInfo = new Page<>(page, pageSize);
    //条件构造器
    LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();
    //添加条件,当name不为空时，模糊匹配姓名
    queryWrapper.like(name != null, Dish::getName, name);
    // 对更新时间进行降序排序，更新时间最晚的在最上面
    queryWrapper.orderByDesc(Dish::getUpdateTime);
    //执行分页查询
    dishService.page(pageInfo, queryWrapper);
    return Result.success(pageInfo);
}
```

重启服务器，效果如下，但是现在没有菜品分类数据，部分图片也没有加载

- 我们只需要把资料中提供好的图片复制到我们存放图片的目录下即可

<img src="https://s2.loli.net/2023/08/14/dUeNxVosS2lchw6.png" alt="image-20230727172727992" style="zoom: 50%;" />

那么为什么没有菜品分类数据呢？

- 我们传递的是一个Dish对象，dish对象没有菜品分类名称属性，但是有菜品分类id
- 那我们就可以根据这个菜品分类id，去菜品分类表中查询对应的菜品分类名称

所以我们之前的`DishDto`类中的另外一个属性就派上用场了，我们返回一个`DishDto`对象就有菜品分类名称数据了

DishDto：

```java
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class DishDto extends Dish {
	
    // 菜品口味列表
    private List<DishFlavor> flavors = new ArrayList<>();

    //菜品分类名称
    private String categoryName;

    private Integer copies;
}
```

那么我们现在就可以把`DishDto`看做是`Dish`类的基础上，增加了一个`categoryName`属性，到时候返回`DishDto`
具体实现思路就是，将查询出来的`dish`数据，赋给`dishDto`，然后在根据`dish`数据中的`category_id`，去菜品分类表中查询到`category_name`，将其赋给`dishDto`

**难点：**

```java
@GetMapping("/page")
    public Result<Page> page(int page, int pageSize, String name) {
        //构造分页构造器对象
        Page<Dish> pageInfo = new Page<>(page, pageSize);
        //这个就是我们到时候返回的结果
        Page<DishDto> dishDtoPage = new Page<>(page, pageSize);
        //条件构造器
        LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();
        //添加条件
        queryWrapper.like(name != null, Dish::getName, name);
        queryWrapper.orderByDesc(Dish::getUpdateTime);
        //执行分页查询
        dishService.page(pageInfo, queryWrapper);

        //对象拷贝，将pageInfo对象中的所有属性，对应的拷贝到dishDtoPage中
        // 并且忽略records集合中的数据，为什么忽悠掉呢，因为records中的数据是展示列表上的所有数据
        // 而原来的数据缺少一个菜品分类属性无法被得到
        // 我们想让这个records中的数据来更新一下，然后赋值给新的分页对象，所以先忽略,由自己来设置
        BeanUtils.copyProperties(pageInfo, dishDtoPage, "records");

        //获取原records数据
        List<Dish> records = pageInfo.getRecords();

        //遍历每一条records数据(里面每一个数据都是Dish对象)
        List<DishDto> list = records.stream().map((item) -> {
            // 新建的DishDto对象，用于存储新数据，也就是菜品分类名称数据
            DishDto dishDto = new DishDto();
            //将旧数据赋给dishDto对象，这里面得到了records中的每一个Dish对象
            // 然后赋值给dishDto
            BeanUtils.copyProperties(item, dishDto);

            //然后获取一下dish对象的category_id属性
            // 得到dish对象的id
            Long categoryId = item.getCategoryId();  //分类id

            //根据这个id属性，获取到Category对象（这里需要用@Autowired注入一个CategoryService对象）
            Category category = categoryService.getById(categoryId);

            //随后获取Category对象的name属性，也就是菜品分类名称
            // 得到id属性，就可以根据id查询对象，并且获得对象的名字
            String categoryName = category.getName();

            //最后将菜品分类名称赋给dishDto对象就好了
            // 最后把对象的菜品分类名称赋值给disDto对象即可
            dishDto.setCategoryName(categoryName);

            //结果返回一个dishDto对象
            return dishDto;

            //并将dishDto对象封装成一个集合，作为我们的最终结果，这个集合，就是要展示的新数据
        }).collect(Collectors.toList());

        // 最后把新数据，设置到这个新的分页上
        dishDtoPage.setRecords(list);
        return Result.success(dishDtoPage);
    }
```



# 修改菜品

## 梳理交互过程

按照惯例，还是先来梳理一下整个流程

1. 页面发送ajax请求，请求服务器获取分类数据，用于菜品分类下拉框的数据回显（之前我们已经实现过了）
2. 页面发送ajax请求，请求服务端，根据id查询当前菜品信息，用于菜品信息回显
3. 页面发送请求，请求服务端进行图片下载，用于页面图片回显（之前我们已经实现过了）
4. 点击保存按钮，页面发送ajax请求，将修改后的菜品相关数据以json形式提交到服务端

<img src="https://s2.loli.net/2023/08/14/AMEwO7hlfrGZ9vJ.png" alt="image-20230727193247689" style="zoom: 50%;" />

开发修改菜品功能，其实就是在服务端写代码去处理以上四次请求



## 查询菜品信息

- 菜品信息回显功能，需要我们先根据id来查询到对应的菜品信息才能回显
- 但修改表单中有一个菜品口味属性，普通的Dish类没有这个属性，所以还是要用到DishDto
- 那我们这里先编写一个`getByIdWithFlavor`方法
- 菜品口味需要根据`dish_id`去`dish_flavor`表中查询，将查询到的菜品口味数据赋给我们的`DishDto`对象即可

```java
// 该方法可以查询菜品对应的口味，用于回显到页面上
public DishDto getByIdWithFlavor(Long id){
    // 通过this，指向Dish对象，利用id得到Dish对象
    Dish dish = this.getById(id);
    DishDto dishDto = new DishDto();
    // 将旧菜品的数据，拷贝到新菜品中
    BeanUtils.copyProperties(dish,dishDto);

    LambdaQueryWrapper<DishFlavor> queryWrapper = new LambdaQueryWrapper<>();
    // 找出口味表中菜品的id与传入的当前菜品表中的id对应的数据
    queryWrapper.eq(DishFlavor::getId,dish.getId());
    List<DishFlavor> flavors = dishFlavorService.list(queryWrapper);

    // 让新菜品设置口味，因为旧菜品不包含口味属性
    dishDto.setFlavors(flavors);

    return dishDto;
}
```

在`DishController`中添加get方法，实现添加在`DishServicelmpl`中的逻辑代码，返回查询到的数据信息

```java
@GetMapping("/{id}")
public Result<DishDto> get(@PathVariable Long id){
    // 通过在dishService中封装的getByIdWithFlavor方法来得到DishDto对象
    // 也就是得到一个新的菜品对象，返回给页面回显数据
    DishDto idWithFlavor = dishService.getByIdWithFlavor(id);
    return Result.success(idWithFlavor);
}
```

然后我们去访问一下修改菜品页面，看看是否有效果，如果没效果，打个断点或者看看日志

##  修改菜品信息

由于Dish表中没有Flavor这个属性，所以修改的时候，我们也是需要修改两张表



修改按钮绑定过的是addFoodtype方法

```html
<el-button
    type="text"
    size="small"
    class="blueBug"
    @click="addFoodtype(scope.row.id)"
>
    修改
</el-button>
```

该方法也是一个新增/修改通用的方法，修改的时候多一个`id`属性

```js
// 添加
addFoodtype (st) {
if (st === 'add'){
    window.parent.menuHandle({
    id: '4',
    url: '/backend/page/food/add.html',
    name: '添加菜品'
    },true)
} else {
    window.parent.menuHandle({
    id: '4',
    url: '/backend/page/food/add.html?id='+st,
    name: '修改菜品'
    },true)
}
```

从这我们能看出请求路径与方式，所以后端代码我们需要提交`PUT`请求

```js
// 修改接口
const editDish = (params) => {
  return $axios({
    url: '/dish',
    method: 'put',
    data: { ...params }
  })
}
```

前端代码就分析到这里，我们开始编写后端逻辑

主要框架就这点东西，重点是编写`updateWithFlavor`方法
首先去DishService中创建`updateWithFlavor`方法，然后在`DishServiceImpl`中重写方法

```java
@PutMapping
public Result<String> update(@RequestBody DishDto dishDto) {
    dishService.updateWithFlavor(dishDto);
    return Result.success("更新菜品成功");
}
```

```java
@Override
public void updateWithFlavor(DishDto dishDto) {
    // 将菜品数据更新到dish表中
    this.updateById(dishDto);

    // 清理之前的菜品口味表，然后增添新的菜品口味上去
    LambdaQueryWrapper<DishFlavor> queryWrapper = new LambdaQueryWrapper<>();
    // 比较菜品口味表中的id与菜品表的id是否相同，如果相同，就删除
    queryWrapper.eq(DishFlavor::getDishId,dishDto.getId());
    // 删除菜品对应的口味
    dishFlavorService.remove(queryWrapper);

    // 添加当前提交过来的口味数据,对getFlavors数据进行数据插入
    List<DishFlavor> flavors = dishDto.getFlavors();

    // 对口味数据进行菜品表id数据的更新
    flavors = flavors.stream().map((item) -> {
        // 设置item(口味)，也就是菜品表的id为当前菜品
        item.setDishId(dishDto.getId());
        return item;
    }).collect(Collectors.toList());

    //同时将菜品口味数据保存到dish_flavor表
    dishFlavorService.saveBatch(flavors);
}
```



注意要在`DishServiceImpl`上添加`@Transactional`注解，同时也要在主启动类上加上`@EnableTransactionManagement`注解



# 新增套餐

## 需求分析

- 套餐就是菜品的集合
- 后台系统中可以管理套餐信息，通过新增套餐来添加一个新的套餐
- 在添加套餐时需要选择当前套餐所属的套餐分类和包含的菜品，并且需要上传套餐对应的图片

## 数据模型

- 新增套餐，其实就是将新增页面录入的套餐信息插入到setmeal表中，而且还要向setmeal_dish表中插入套餐和菜品关联数据
- 所以在新增套餐时，需要对两张表进行操作
	1. setmeal表 —> 套餐表
	2. setmeal_dish表 —> 套餐菜品关系表

setmeal表

|    Field    |     Type      | Collation | Null | Key  | Default |      Comment       |
| :---------: | :-----------: | :-------: | :--: | :--: | :-----: | :----------------: |
|     id      |    bigint     |  (NULL)   |  NO  | PRI  | (NULL)  |        主键        |
| category_id |    bigint     |  (NULL)   |  NO  |      | (NULL)  |     菜品分类id     |
|    name     |  varchar(64)  | utf8_bin  |  NO  | UNI  | (NULL)  |      套餐名称      |
|    price    | decimal(10,2) |  (NULL)   |  NO  |      | (NULL)  |      套餐价格      |
|   status    |      int      |  (NULL)   | YES  |      | (NULL)  | 状态 0:停用 1:启用 |
|    code     |  varchar(32)  | utf8_bin  | YES  |      | (NULL)  |        编码        |
| description | varchar(512)  | utf8_bin  | YES  |      | (NULL)  |      描述信息      |
|    image    | varchar(255)  | utf8_bin  | YES  |      | (NULL)  |        图片        |
| create_time |   datetime    |  (NULL)   |  NO  |      | (NULL)  |      创建时间      |
| update_time |   datetime    |  (NULL)   |  NO  |      | (NULL)  |      更新时间      |
| create_user |    bigint     |  (NULL)   |  NO  |      | (NULL)  |       创建人       |
| update_user |    bigint     |  (NULL)   |  NO  |      | (NULL)  |       修改人       |
| is_deleted  |      int      |  (NULL)   |  NO  |      |    0    |      是否删除      |

setmeal_dish表

|    Field    |     Type      | Collation | Null | Key  | Default |        Comment        |
| :---------: | :-----------: | :-------: | :--: | :--: | :-----: | :-------------------: |
|     id      |    bigint     |  (NULL)   |  NO  | PRI  | (NULL)  |         主键          |
| setmeal_id  |  varchar(32)  | utf8_bin  |  NO  |      | (NULL)  |        套餐id         |
|   dish_id   |  varchar(32)  | utf8_bin  |  NO  |      | (NULL)  |        菜品id         |
|    name     |  varchar(32)  | utf8_bin  | YES  |      | (NULL)  | 菜品名称 （冗余字段） |
|    price    | decimal(10,2) |  (NULL)   | YES  |      | (NULL)  | 菜品原价（冗余字段）  |
|   copies    |      int      |  (NULL)   |  NO  |      | (NULL)  |         份数          |
|    sort     |      int      |  (NULL)   |  NO  |      |    0    |         排序          |
| create_time |   datetime    |  (NULL)   |  NO  |      | (NULL)  |       创建时间        |
| update_time |   datetime    |  (NULL)   |  NO  |      | (NULL)  |       更新时间        |
| create_user |    bigint     |  (NULL)   |  NO  |      | (NULL)  |        创建人         |
| update_user |    bigint     |  (NULL)   |  NO  |      | (NULL)  |        修改人         |
| is_deleted  |      int      |  (NULL)   |  NO  |      |    0    |       是否删除        |

## 准备工作

在开发业务功能前，先将需要用到的类和接口基本结构创建好:

实体类SetmealDish

```java
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 套餐菜品关系
 * 就是指在某个套餐中的菜品
 */
@Data
public class SetmealDish implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;


    //套餐id
    private Long setmealId;


    //菜品id
    private Long dishId;


    //菜品名称 （冗余字段）
    private String name;

    //菜品原价
    private BigDecimal price;

    //份数
    private Integer copies;


    //排序
    private Integer sort;


    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;


    @TableField(fill = FieldFill.INSERT)
    private Long createUser;


    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;


    //是否删除
    private Integer isDeleted;
}
```

DTO SetmealDto
普通的SetmealDish类肯定是不够我们用的，这里还需要加上套餐内的具体菜品和套餐分类名称

```java
import lombok.Data;

import java.util.List;

@Data
public class SetmealDto extends Setmeal {

    private List<SetmealDish> setmealDishes;

    private String categoryName;
}
```

Mapper接口SetmealDishMapper

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.eastwind.entity.SetmealDish;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SetmealDishMapper extends BaseMapper<SetmealDish> {
}
```

业务层接口SetmealDishService

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.eastwind.entity.SetmealDish;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SetmealDishMapper extends BaseMapper<SetmealDish> {
}
```

业务层实现类SetmealDishServiceImpl

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.SetmealDish;
import com.eastwind.mapper.SetmealDishMapper;
import com.eastwind.service.SetmealDishService;
import org.springframework.stereotype.Service;

@Service
public class SetmealDishServiceImpl extends ServiceImpl<SetmealDishMapper, SetmealDish> implements SetmealDishService {
}
```

控制层SetmealController

```java
import com.eastwind.service.SetMealService;
import com.eastwind.service.SetmealDishService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/setmeal")
@Slf4j
public class SetmealController {
    
    @Autowired
    private SetMealService setMealService;
    
    @Autowired
    private SetmealDishService setmealDishService;
    
}
```

## 梳理交互过程

在开发代码之前，我们先来梳理一下新增套餐时前端页面与服务端的交互过程

1. 页面发送ajax请求，请求服务端，获取套餐分类数据并展示到下拉框中（这个之前做过）
2. 页面发送ajax请求，请求服务端，获取菜品分类数据并展示到添加菜品窗口中
3. 页面发送ajax请求，请求服务端，根据菜品分类查询对应的菜品数据并展示到添加菜品窗口中
4. 页面发送请求进行图片上传，请求服务端将图片保存到服务器（已完成）
5. 页面发送请求进行图片下载，将上传的图片进行回显（已完成）
6. 点击保存按钮，发送ajax请求，将套餐相关数据以json形式提交到服务端

开发新增套餐功能，其实就是在服务端编写代码去处理前端页面发送的这6次请求

## 代码开发

新增套餐页面，现在的套餐分类下拉框中已经能显示套餐分类了，这个功能在之前我们已经实现过了，在菜品分类的时候做的

<img src="https://s2.loli.net/2023/08/14/CN6FXGMKk37wRVS.png" alt="image-20230728075441771" style="zoom: 50%;" />

添加菜品页面，这个页面是发送的`GET`请求，且路径为`dish/list?categoryId=xxx`

![image-20230728075514756](https://s2.loli.net/2023/08/14/SJhK16br9kUd3qC.png)

所以我们先去DishController中编写对应的get方法来正确显示菜品数据

```java
@GetMapping("/list")
public Result<List<Dish>> get(Dish dish){
    // Dish泛型在LambdaQueryWrapper中的作用是指定查询目标实体类类型的内容
    LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();
    // 比较传入的菜品id和数据库中的id是否相同
    queryWrapper.eq(dish.getCategoryId() != null,Dish::getCategoryId,dish.getCategoryId());
    // 查询该菜品的启用情况，启用时，才会展示
    queryWrapper.eq(Dish::getStatus,1);
    // 先用sort升序排序，sort相同的情况下，对更新时间降序排序
    queryWrapper.orderByAsc(Dish::getSort).orderByDesc(Dish::getUpdateTime);
    List<Dish> list = dishService.list(queryWrapper);
    return Result.success(list);
}
```

编写save方法

我们先打个断点，看看提交的数据是啥样的

```java
@PostMapping
public Result<String> save(@RequestBody SetmealDto setmealDto) {
    log.info("套餐信息：{}", setmealDto);
    return Result.success("套餐添加成功");
}
```

![image-20230728091012027](https://s2.loli.net/2023/08/14/M8b43rDGgpyU2sW.png)

需要注意的是这个setmealId为null，我们具体的代码中，要从setmealDao中获取并赋值

controller层

这里依旧是需要我们自己在SetmealService中编写一个setWithDish方法，并在SetmealServiceImpl中实现

```java
import com.eastwind.common.Result;
import com.eastwind.entity.SetmealDto;
import com.eastwind.service.SetMealService;
import com.eastwind.service.SetmealDishService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/setmeal")
@Slf4j
public class SetmealController {

    @Autowired
    private SetMealService setMealService;

    @Autowired
    private SetmealDishService setmealDishService;


    @PostMapping
    public Result<String> save(@RequestBody SetmealDto setmealDto) {
        log.info("套餐信息：{}", setmealDto);
        setMealService.saveWithDish(setmealDto);
        return Result.success("套餐添加成功");
    }

}
```

业务层SetMealService

```java
import com.baomidou.mybatisplus.extension.service.IService;
import com.eastwind.entity.Setmeal;
import com.eastwind.entity.SetmealDto;

public interface SetMealService extends IService<Setmeal> {
    void saveWithDish(SetmealDto setmealDto);
}
```

业务层实现类

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.Setmeal;
import com.eastwind.entity.SetmealDish;
import com.eastwind.entity.SetmealDto;
import com.eastwind.mapper.SetmealMapper;
import com.eastwind.service.SetmealDishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SetMealServiceImpl extends ServiceImpl<SetmealMapper, Setmeal> implements com.eastwind.service.SetMealService {
    @Autowired
    SetmealDishService setmealDishService;

    @Override
    public void saveWithDish(SetmealDto setmealDto) {
        // 将setmealDto传递进来，保存套餐表的基本信息
        this.save(setmealDto);
        // 得到该套餐对应的菜品
        List<SetmealDish> setmealDishes = setmealDto.getSetmealDishes();
        setmealDishes = setmealDishes.stream().map((item) -> {
            // 并让每一个菜品都设置一下套餐id,因为传递的时候没法给菜品设置套餐id
            // 因为传递的时候套餐id是需要在套餐数据保存后使用算法生成的，在保存数据后，才能让关联的菜品设置套餐id
            item.setSetmealId(setmealDto.getId());
            return item;
        }).collect(Collectors.toList());
        setmealDishService.saveBatch(setmealDishes);
    }
}
```

## 前端代码分析

```html
<el-button type="primary" @click="submitForm('ruleForm', false)"> 保存 </el-button>
```

单击后触发`submitForm`方法

表单提交也是一个通用的代码，分为新增/修改

```js
submitForm(formName, st) {
    this.$refs[formName].validate((valid) => {
        if (valid) {
        let prams = { ...this.ruleForm }
        prams.price *= 100
        prams.setmealDishes = this.dishTable.map((obj) => ({
            copies: obj.copies,
            dishId: obj.dishId,
            name: obj.name,
            price: obj.price,
        }))
        prams.status = this.ruleForm ? 1 : 0
        prams.categoryId = this.ruleForm.idType
        if(prams.setmealDishes.length < 1){
            this.$message.error('请选择菜品！')
            return 
        }
        if(!this.imageUrl){
            this.$message.error('请上传套餐图片')
            return 
        }
        // delete prams.dishList
        if (this.actionType == 'add') {
            delete prams.id
            addSetmeal(prams)
            .then((res) => {
                if (res.code === 1) {
                this.$message.success('套餐添加成功！')
                if (!st) {
                    this.goBack()
                } else {
                    this.$refs.ruleForm.resetFields()
                    this.dishList = []
                    this.dishTable = []
                    this.ruleForm = {
                    name: '',
                    categoryId: '',
                    price: '',
                    code: '',
                    image: '',
                    description: '',
                    dishList: [],
                    status: true,
                    id: '',
                    idType: '',
                    }
                    this.imageUrl = ''
                }
                } else {
                this.$message.error(res.msg || '操作失败')
                }
            })
            .catch((err) => {
                this.$message.error('请求出错了：' + err)
            })
        } else {
            delete prams.updateTime
            editSetmeal(prams)
            .then((res) => {
                if (res.code === 1) {
                this.$message.success('套餐修改成功！')
                this.goBack()
                } else {
                this.$message.error(res.msg || '操作失败')
                }
            })
            .catch((err) => {
                this.$message.error('请求出错了：' + err)
            })
        }
        } else {
        return false
        }
    })
}
```

新增套餐的保存按钮是发送的`post`请求，请求路径为`/setmeal`

```js
// 新增数据接口
const addSetmeal = (params) => {
  return $axios({
    url: '/setmeal',
    method: 'post',
    data: { ...params }
  })
}
```



# 套餐信息分页查询

## 需求分析

- 系统中的套餐数据很多的时候，如果在一个页面中全部展示出来会显得比较乱，不便于查看
- 一般的系统中都会以分页的方式来展示列表数据

## 梳理交互过程

1. 页面发送ajax请求，将分页查询参数（page，pageSize，name）提交到服务端，获取分页数据
2. 页面发送请求，请求服务端进行图片下载，用于页面图片展示（已完成）

## 前端分析

点击套餐管理，在搜索框输入1，获取请求url与请求方式

- 请求网址: http://localhost/setmeal/page?page=1&pageSize=10&name=1
- 请求方法: GET

##  代码开发

- SetmealController类中，添加list方法
	其实跟前面的菜品信息分页查询代码几乎一模一样，这遍就当review了

```java
@GetMapping("/page")
public Result<Page> page(int page,int pageSize,String name) {
    Page<Setmeal> pageInfo = new Page<>(page, pageSize);
    Page<SetmealDto> dtoPage = new Page<>(page, pageSize);
    // 条件构造器
    LambdaQueryWrapper<Setmeal> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.like(name != null,Setmeal::getName,name);
    queryWrapper.orderByDesc(Setmeal::getUpdateTime);
    // 执行分页查询
    setMealService.page(pageInfo,queryWrapper);

    BeanUtils.copyProperties(pageInfo,dtoPage,"records");

    // 得到之前的数据，对它的分类进行赋值更新
    List<SetmealDto> records = dtoPage.getRecords();
    records = records.stream().map((item) -> {
        SetmealDto setmealDto = new SetmealDto();
        // 将旧数据赋值给新数据，再对数据分类进行更新
        BeanUtils.copyProperties(item,setmealDto);
        // 得到套餐的Id,因为套餐关联了分类，所以我们可以去分类里查询相关的名称
        Long categoryId = item.getCategoryId();
        Category category = categoryService.getById(categoryId);

        if (category != null) {
            String categoryName = category.getName();
            // 将套餐分类名称赋值给新数据
            setmealDto.setCategoryName(categoryName);
        }
        return setmealDto;
    }).collect(Collectors.toList());

    dtoPage.setRecords(records);

    return Result.success(dtoPage);
}
```



# 删除套餐

## 需求分析

- 在套餐管理列表页面点击删除按钮，可以删除对应的套餐信息
- 也可以通过复选框选择多个套餐，选择批量删除一次性删除多个套餐

注意：对于`在售`中的套餐不能删除，需要先`停售`，然后才能删除

## 梳理交互过程

1. 删除单个套餐时，页面发送ajax请求，根据套餐id删除对应套餐
2. 删除多个套餐时，页面发送ajax请求，根据提交的多个套餐id删除对应套餐开发删除套餐功能
	- 请求网址: http://localhost/setmeal?ids=1579044544635232258,1415580119015145474
	- 请求方法: DELETE

- 删除单个套餐和批量删除这两种请求的地址和请求方式都是相同的
- 不同的则是传递的id个数，所以在服务端可以提供一个方法来统一处理。

## 代码开发

在SetmealController中添加`delete`方法

```java
@DeleteMapping
public Result<String> delete(@RequestParam List<Long> ids){
    if (ids.size() == 0){
        throw new CustomException("请选中你要删除的套餐");
    }
    setMealService.removeWithDish(ids);
    return Result.success("删除成功");
}
```

这里我加入了一个判断，是为了确保用户万一点击时不携带参数所做的预防

@RequestParam记得给ids加上

业务层SetMealService

```java
void removeWithDish(List<Long> ids);
```

业务层实现类SetMealServiceImpl

```java
/**
 * 用来删除套餐
 * */
@Override
public void removeWithDish(List<Long> ids) {
    LambdaQueryWrapper<Setmeal> queryWrapper = new LambdaQueryWrapper<>();
    // 根据这一组id来查询对应的套餐(删除多个套餐的情况)
    queryWrapper.in(Setmeal::getId,ids);

    // 查询这组被查出来的数据，状态是否为1
    queryWrapper.eq(Setmeal::getStatus,1);

    // 得到查询的结果
    int count = this.count(queryWrapper);
    if (count > 0){
        // count　> 0 ：说明删除的数据中，包含在售的套餐
        throw new CustomException("套餐正在售卖中，请先停售再进行删除");
    }

    // 如果没有在售套餐，则直接删除
    this.removeByIds(ids);

    // 这里删除的是套餐所绑定的菜品
    LambdaQueryWrapper<SetmealDish> wrapper = new LambdaQueryWrapper<>();
    // 套餐菜品表中的套餐id，是否存在于这个传入的套餐id中
    wrapper.in(SetmealDish::getSetmealId,ids);
    // 存在的，都删除掉
    setmealDishService.remove(wrapper);
}
```



# 邮件发送（替换手机验证）

其实黑马这里用的是短信业务，但咱也没那条件，所以我只能自己换成QQ邮箱验证码了，这个简单，具体操作我们也只需要开启POP3/STMP服务，获取一个16位的授权码

![image-20230728142908901](https://s2.loli.net/2023/08/14/I2rH5f7jPYZwQVC.png)

<img src="https://s2.loli.net/2023/08/14/UxFiCrz64RvZYHa.png" alt="image-20230728142949887" style="zoom:50%;" />

邮件发送的授权码：**xnuuzgfmxuzedcdj**

## 需求分析

为了方便用户登录，移动端通常都会提供通过手机验证码登录的功能(咱平替成邮箱验证码)

手机（邮箱）验证码登录的优点：

- 方便快捷，无需注册，直接登录
- 使用短信验证码作为登录凭证，无需记忆密码
- 安全

登录流程:

- 输入手机号（邮箱） > 获取验证码 > 输入验证码 > 点击登录 > 登录成功

用户登录界面

![image-20230728143108122](https://s2.loli.net/2023/08/14/YV1tKP5sqNoyb8n.png)

注意:通过手机（邮箱）验证码登录，手机号是区分不同用户的标识

## 数据模型

这里的手机号也是varchar类型，所以我们就不用动它了，咱就用它存咱自己邮箱号就行（动手能力强的自己改一下也无所谓，大不了改出BUG再自己修）

|   Field   |     Type     | Collation | Null | Key  | Default |       Comment       |
| :-------: | :----------: | :-------: | :--: | :--: | :-----: | :-----------------: |
|    id     |    bigint    |  (NULL)   |  NO  | PRI  | (NULL)  |        主键         |
|   name    | varchar(50)  | utf8_bin  | YES  |      | (NULL)  |        姓名         |
|   phone   | varchar(100) | utf8_bin  |  NO  |      | (NULL)  |       手机号        |
|    sex    |  varchar(2)  | utf8_bin  | YES  |      | (NULL)  |        性别         |
| id_number | varchar(18)  | utf8_bin  | YES  |      | (NULL)  |      身份证号       |
|  avatar   | varchar(500) | utf8_bin  | YES  |      | (NULL)  |        头像         |
|  status   |     int      |  (NULL)   | YES  |      |    0    | 状态 0:禁用，1:正常 |

- 手机号（邮箱）是区分不同用户的标识，在用户登录的时候判断所输入的手机号（邮箱）是否存储在表中
- 如果不在表中，说明该用户为一个**新的用户**，将该用户自动保存在`user`表中

在开发业务功能之前，我们先将要用到的类和接口的基本结构都创建好

实体类User

```java
/**
 * 用户信息
 */
@Data
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;


    //姓名
    private String name;


    //手机号
    private String phone;


    //性别 0 女 1 男
    private String sex;


    //身份证号
    private String idNumber;


    //头像
    private String avatar;


    //状态 0:禁用，1:正常
    private Integer status;
}
```

Mapper接口UserMapper

```java
@Mapper
public interface UserMapper extends BaseMapper {
}
```

业务层接口UserService

```java
public interface UserService extends IService<User> {
}
```

业务层实现类UserServiceImpl

```java
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper,User> implements UserService {
}
```

控制层UserController

```java
@RestController
@Slf4j
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

}
```

工具类（我们自己造自己的邮箱工具类）

- 首先导入坐标

```xml
<!-- https://mvnrepository.com/artifact/javax.activation/activation -->
<dependency>
    <groupId>javax.activation</groupId>
    <artifactId>activation</artifactId>
    <version>1.1.1</version>
</dependency>
<!-- https://mvnrepository.com/artifact/javax.mail/mail -->
<dependency>
    <groupId>javax.mail</groupId>
    <artifactId>mail</artifactId>
    <version>1.4.7</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.apache.commons/commons-email -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-email</artifactId>
    <version>1.4</version>
</dependency>
```

然后编写一个工具类，用于发送邮件验证码

```java
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;

public class MailUtils {
    public static void main(String[] args) throws MessagingException {
        //可以在这里直接测试方法，填自己的邮箱即可
        sendTestMail("zhanghan2333@qq.com", new MailUtils().achieveCode());
    }

    public static void sendTestMail(String email, String code) throws MessagingException {
        // 创建Properties 类用于记录邮箱的一些属性
        Properties props = new Properties();
        // 表示SMTP发送邮件，必须进行身份验证
        props.put("mail.smtp.auth", "true");
        //此处填写SMTP服务器
        props.put("mail.smtp.host", "smtp.qq.com");
        //端口号，QQ邮箱端口587
        props.put("mail.smtp.port", "587");
        // 此处填写，写信人的账号
        props.put("mail.user", "zhanghan2333@qq.com");
        // 此处填写16位STMP口令
        props.put("mail.password", "xnuuzgfmxuzedcdj");
        // 构建授权信息，用于进行SMTP进行身份验证
        Authenticator authenticator = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                // 用户名、密码
                String userName = props.getProperty("mail.user");
                String password = props.getProperty("mail.password");
                return new PasswordAuthentication(userName, password);
            }
        };
        // 使用环境属性和授权信息，创建邮件会话
        Session mailSession = Session.getInstance(props, authenticator);
        // 创建邮件消息
        MimeMessage message = new MimeMessage(mailSession);
        // 设置发件人
        InternetAddress form = new InternetAddress(props.getProperty("mail.user"));
        message.setFrom(form);
        // 设置收件人的邮箱
        InternetAddress to = new InternetAddress(email);
        message.setRecipient(RecipientType.TO, to);
        // 设置邮件标题
        message.setSubject("Kyle's Blog 邮件测试");
        // 设置邮件的内容体
        message.setContent("尊敬的用户:你好!\n注册验证码为:" + code + "(有效期为一分钟,请勿告知他人)", "text/html;charset=UTF-8");
        // 最后当然就是发送邮件啦
        Transport.send(message);
    }

    public static String achieveCode() {  //由于数字 1 、 0 和字母 O 、l 有时分不清楚，所以，没有数字 1 、 0
        String[] beforeShuffle = new String[]{"2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F",
                "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a",
                "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
                "w", "x", "y", "z"};
        List<String> list = Arrays.asList(beforeShuffle);//将数组转换为集合
        Collections.shuffle(list);  //打乱集合顺序
        StringBuilder sb = new StringBuilder();
        for (String s : list) {
            sb.append(s); //将集合转化为字符串
        }
        return sb.substring(3, 8);
    }
}
```

## 修改拦截器

对用户登录操作放行

```java
//定义不需要处理的请求
String[] urls = new String[]{
        "/employee/login",
        "/employee/logout",
        "/backend/**",
        "/front/**",
        "/common/**",
        //对用户登陆操作放行
        "/user/login",
        "/user/sendMsg"
};
```

判断用户是否登录

```java
if (request.getSession().getAttribute("user") != null){
    log.info("用户已登录，用户id为：{}",request.getSession().getAttribute("user"));
    Long userId = (Long)request.getSession().getAttribute("user");
    BaseContext.setCurrentId(userId);
    filterChain.doFilter(request,response);
    return;
}
```

## 发送验证码

由于这里部分前端代码做了修改，我们也需要修改一下

在front/page/login.html中修改

![image-20230728153000610](https://s2.loli.net/2023/08/14/JxrTIpemuRZknzh.png)

这里有一个sendMsg方法，代码中没有，需要在front/api/login.js中添加

```js
function sendMsgApi(data) {
    return $axios({
        'url': '/user/sendMsg',
        'method': 'post',
        data
    })
}
```

并更新btnLogin

```js
async btnLogin(){
    if(this.form.phone && this.form.code){
        this.loading = true
        const res = await loginApi({phone:this.form.phone,code:this.form.code})
        this.loading = false
        if(res.code === 1){
            sessionStorage.setItem("userPhone",this.form.phone)
            window.requestAnimationFrame(()=>{
                window.location.href= '/front/index.html'
            })
        }else{
            this.$notify({ type:'warning', message:res.msg});
        }
    }else{
        this.$notify({ type:'warning', message:'请输入手机号码'});
    }
}
```

再次尝试发送请求，就可以成功了(如果失败，记得清空缓存)

发送验证码的请求方式是POST，路径为`/user/sendMsg`

那么我们在UserController控制层中，添加sendMsg方法
这个是真滴能发送的奥，邮箱里可以收到的，待会儿我就写校验功能了

```java
@PostMapping("/sendMsg")
public Result<String> sendMsg(@RequestBody User user, HttpSession session) throws MessagingException {
    // 得到json字符串中的号码对象
    String phone = user.getPhone();
    // 如果号码不为空
    if (!phone.isEmpty()) {
        //随机生成一个验证码(利用MailUtils工具类)
        String code = MailUtils.achieveCode();
        log.info(code);
        //这里的phone其实就是邮箱，code是我们生成的验证码
        MailUtils.sendTestMail(phone, code);
        //验证码存session，方便后面拿出来比对
        session.setAttribute(phone, code);
        return Result.success("验证码发送成功");
    }
    return Result.error("验证码发送失败");
}
```

输入验证码，点击登录

- 请求方法为Post,请求路径为:`/user/login`，数据以json格式返回给服务端![image-20230728153451260](https://s2.loli.net/2023/08/14/YrOv3QjVzWkobUK.png)

	![image-20230728153808583](https://s2.loli.net/2023/08/14/QXTlBzk85hICdxW.png)

在UserController控制层中，添加`login`方法
先用日志输出一下，看看是否能接受到数据

```java
@PostMapping("/login")
public Result<String> login(@RequestBody Map map,HttpSession session){
    log.info(map.toString());
    return null;
}
```

测试之后发现，可以得到数据

```java
@PostMapping("/login")
public Result<User> login(@RequestBody Map map, HttpSession session) {
    log.info(map.toString());
    //获取邮箱
    String phone = map.get("phone").toString();
    //获取验证码
    String code = map.get("code").toString();
    //从session中获取验证码
    String codeInSession = session.getAttribute(phone).toString();
    //比较这用户输入的验证码和session中存的验证码是否一致
    if (code != null && code.equals(codeInSession)) {
        //如果输入正确，判断一下当前用户是否存在
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        //判断依据是从数据库中查询是否有其邮箱
        queryWrapper.eq(User::getPhone, phone);
        User user = userService.getOne(queryWrapper);
        //如果不存在，则创建一个，存入数据库
        if (user == null) {
            user = new User();
            user.setPhone(phone);
            userService.save(user);
            user.setName("用户" + codeInSession);
        }
        //存个session，表示登录状态
        session.setAttribute("user",user.getId());
        //并将其作为结果返回
        return Result.success(user);
    }
    return Result.error("登录失败");
}
```

大功告成，输入邮箱，获取验证码，点击提交，正常登录，去数据库中查询，phone字段有我们刚刚填写的邮箱

<img src="https://s2.loli.net/2023/08/14/oxpql7Gf8jcYvaA.png" alt="image-20230728154520879" style="zoom:33%;" />

可能遇到的问题：

- ```
	javax.mail.AuthenticationFailedException: 535 Login Fail.
	```

	- 遇到这个问题请重新获取一下授权码并更新授权码

- 如果在从session中取code验证码的时候报

	```
	java.lang.NullPointerException
	```

	- 请清除浏览器缓存之后再次测试



# 地址簿

## 需求分析

- 地址簿，指的是移动端消费者用户的地址信息（外卖快递的收货地址）
- 用户登录成功后可以维护自己的地址信息（自己修改删除新增等）
- 同一个用户可以有多个地址信息，但是只能有一个默认地址。（有默认地址的话会很方便）

## 数据模型

**注意这里的phone类型为varchar(11)，这显然不够我们邮箱用的，所以我们自己改一下这里，改大一点，不然做到新增地址的时候，会报错**
`com.mysql.cj.jdbc.exceptions.MysqlDataTruncation: Data truncation: Data too long for column 'phone' at row 1`

|     Field     |     Type     |     Collation      | Null | Key  | Default |    Comment     |
| :-----------: | :----------: | :----------------: | :--: | :--: | :-----: | :------------: |
|      id       |    bigint    |       (NULL)       |  NO  | PRI  | (NULL)  |      主键      |
|    user_id    |    bigint    |       (NULL)       |  NO  |      | (NULL)  |     用户id     |
|   consignee   | varchar(50)  |      utf8_bin      |  NO  |      | (NULL)  |     收货人     |
|      sex      |   tinyint    |       (NULL)       |  NO  |      | (NULL)  | 性别 0 女 1 男 |
|     phone     | varchar(11)  |      utf8_bin      |  NO  |      | (NULL)  |     手机号     |
| province_code | varchar(12)  | utf8mb4_0900_ai_ci | YES  |      | (NULL)  |  省级区划编号  |
| province_name | varchar(32)  | utf8mb4_0900_ai_ci | YES  |      | (NULL)  |    省级名称    |
|   city_code   | varchar(12)  | utf8mb4_0900_ai_ci | YES  |      | (NULL)  |  市级区划编号  |
|   city_name   | varchar(32)  | utf8mb4_0900_ai_ci | YES  |      | (NULL)  |    市级名称    |
| district_code | varchar(12)  | utf8mb4_0900_ai_ci | YES  |      | (NULL)  |  区级区划编号  |
| district_name | varchar(32)  | utf8mb4_0900_ai_ci | YES  |      | (NULL)  |    区级名称    |
|    detail     | varchar(200) | utf8mb4_0900_ai_ci | YES  |      | (NULL)  |    详细地址    |
|     label     | varchar(100) | utf8mb4_0900_ai_ci | YES  |      | (NULL)  |      标签      |
|  is_default   |  tinyint(1)  |       (NULL)       |  NO  |      |    0    | 默认 0 否 1是  |
|  create_time  |   datetime   |       (NULL)       |  NO  |      | (NULL)  |    创建时间    |
|  update_time  |   datetime   |       (NULL)       |  NO  |      | (NULL)  |    更新时间    |
|  create_user  |    bigint    |       (NULL)       |  NO  |      | (NULL)  |     创建人     |
|  update_user  |    bigint    |       (NULL)       |  NO  |      | (NULL)  |     修改人     |
|  is_deleted   |     int      |       (NULL)       |  NO  |      |    0    |    是否删除    |

## 准备工作

创建对应的实体类`AddressBook`

```java
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 地址簿
 */
@Data
public class AddressBook implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;


    //用户id
    private Long userId;


    //收货人
    private String consignee;


    //手机号
    private String phone;


    //性别 0 女 1 男
    private String sex;


    //省级区划编号
    private String provinceCode;


    //省级名称
    private String provinceName;


    //市级区划编号
    private String cityCode;


    //市级名称
    private String cityName;


    //区级区划编号
    private String districtCode;


    //区级名称
    private String districtName;


    //详细地址
    private String detail;


    //标签
    private String label;

    //是否默认 0否 1是
    private Integer isDefault;

    //创建时间
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;


    //更新时间
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;


    //创建人
    @TableField(fill = FieldFill.INSERT)
    private Long createUser;


    //修改人
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;


    //是否删除
    private Integer isDeleted;
}
```

Mapper接口AddressBookMapper

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.eastwind.entity.AddressBook;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AddressBookMapper extends BaseMapper<AddressBook> {
}
```

业务层AddressBookService

```java
import com.baomidou.mybatisplus.extension.service.IService;
import com.eastwind.entity.AddressBook;

public interface AddressBookService extends IService<AddressBook> {
}
```

业务层实现类AddressBookServiceImpl

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.AddressBook;
import com.eastwind.mapper.AddressBookMapper;
import com.eastwind.service.AddressBookService;
import org.springframework.stereotype.Service;

@Service
public class AddressBookServiceImpl extends ServiceImpl<AddressBookMapper, AddressBook> implements AddressBookService {
}
```

控制层AddressBookController

```java
import com.eastwind.service.AddressBookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/addressBook")
@Slf4j
public class AddressBookController {
    @Autowired
    AddressBookService addressBookService;

}
```

然后需要导入地址簿中的代码

### 新增：

```java
@PostMapping
public Result<AddressBook> save(@RequestBody AddressBook addressBook){
    // 为地址添加当前用户id，用户id需要手动添加
    addressBook.setUserId(BaseContext.getCurrentId());
    addressBookService.save(addressBook);
    return Result.success(addressBook);
}
```

### 设置默认地址：

```java
/**
 * 设置默认地址
 * */
@PutMapping("default")
public Result<AddressBook> setDefault(@RequestBody AddressBook addressBook){
    LambdaUpdateWrapper<AddressBook> updateWrapper = new LambdaUpdateWrapper<>();
    // 查询当前所在用户的地址
    updateWrapper.eq(AddressBook::getUserId,BaseContext.getCurrentId());
    // 设置所有的地址id为0,0表示非默认地址
    updateWrapper.set(AddressBook::getIsDefault,0);
    addressBookService.update(updateWrapper);

    // 设置当前地址为默认地址
    addressBook.setIsDefault(1);
    addressBookService.updateById(addressBook);
    return Result.success(addressBook);
}
```

### 根据id查询地址

```java
/**
 * 根据id查询地址
 */
@GetMapping("/{id}")
public Result<AddressBook> get(@PathVariable Long id) {
    AddressBook bookServiceById = addressBookService.getById(id);
    if (bookServiceById != null) {
        // 如果找到了地址，就把地址数据查询给页面
        return Result.success(bookServiceById);
    }
    return Result.error("没有找到该地址");
}
```

### 查询默认地址

```java
/**
 * 查询默认地址
 */
@GetMapping("default")
public Result<AddressBook> getDefault() {
    LambdaQueryWrapper<AddressBook> queryWrapper = new LambdaQueryWrapper<>();
    // 从当前登录用户查找地址
    queryWrapper.eq(AddressBook::getUserId, BaseContext.getCurrentId());
    // 并且为默认地址值：1
    queryWrapper.eq(AddressBook::getIsDefault, 1);
    AddressBook addressBook = addressBookService.getOne(queryWrapper);
    if (addressBook != null) {
        return Result.success(addressBook);
    }
    return Result.error("没有找到该地址");
}
```

### 查询指定用户的全部地址

```java
/**
 * 查询指定用户的全部地址
 */
@GetMapping("/list")
public Result<List<AddressBook>> getList(AddressBook addressBook) {
    // 为地址簿设置当前用户id
    addressBook.setUserId(BaseContext.getCurrentId());

    LambdaQueryWrapper<AddressBook> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(addressBook.getUserId() != null, AddressBook::getUserId, addressBook.getUserId());
    queryWrapper.orderByDesc(AddressBook::getUpdateTime);
    List<AddressBook> list = addressBookService.list(queryWrapper);
    return Result.success(list);
}
```

### 修改前端代码

这段代码是新增地址的前端代码，我们将其中的手机号全部替换成邮箱，判断手机号的正则也换成判断邮箱的正则，懒人就直接Copy我这段代码就好了

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no,minimal-ui">
        <title>菩提阁</title>
        <link rel="icon" href="./../images/favico.ico">
        <!--不同屏幕尺寸根字体设置-->
        <script src="./../js/base.js"></script>
        <!--element-ui的样式-->
        <link rel="stylesheet" href="../../backend/plugins/element-ui/index.css" />
        <!--引入vant样式-->
        <link rel="stylesheet" href="../styles/vant.min.css"/>
        <!-- 引入样式  -->
        <link rel="stylesheet" href="../styles/index.css" />
        <!--本页面内容的样式-->
        <link rel="stylesheet" href="./../styles/address-edit.css" />
    </head>
    <body>
        <div id="address_edit" class="app">
            <div class="divHead">
                <div class="divTitle">
                    <i class="el-icon-arrow-left" @click="goBack"></i>{{title}}
                </div>
            </div>
            <div class="divContent">
                <div class="divItem">
                   <span>联系人：</span> 
                   <el-input placeholder=" 请填写收货人的姓名" v-model="form.consignee"  maxlength='10' class="inputUser"/></el-input>
                   <span class="spanChecked" @click="form.sex = '1'">
                    <i :class="{iActive:form.sex === '1'}"></i>
                    先生
                   </span>
                   <span class="spanChecked" @click="form.sex = '0'">
                    <i :class="{iActive:form.sex === '0'}"></i>
                    女士
                </span>
                </div>
                <div class="divItem">
                    <span>邮箱：</span>
                    <el-input placeholder=" 请填写收货人邮箱" v-model="form.phone"  maxlength='20' style="width: calc(100% - 80rem);"/></el-input>
                </div>
                <div class="divItem">
                    <span>收货地址：</span> 
                    <el-input placeholder=" 请输入收货地址" v-model="form.detail"  maxlength='140'/></el-input>
                </div>
                <div class="divItem ">
                    <span>标签：</span> 
                    <span v-for="(item,index) in labelList" :key="index" @click="form.label = item;activeIndex = index" :class="{spanItem:true,spanActiveSchool:activeIndex === index}">{{item}}</span>
                </div>
                <div class="divSave" @click="saveAddress">保存地址</div>
                <div class="divDelete" @click="deleteAddress" v-if="id">删除地址</div>
            </div>
        </div>
        <!-- 开发环境版本,包含了有帮助的命令行警告 -->
        <script src="../../backend/plugins/vue/vue.js"></script>
        <!-- 引入组件库 -->
        <script src="../../backend/plugins/element-ui/index.js"></script>
        <!-- 引入vant样式 -->
        <script src="./../js/vant.min.js"></script>       
        <script src="./../js/common.js"></script>
        <script src="./../api/address.js"></script>
        <!-- 引入axios -->
        <script src="../../backend/plugins/axios/axios.min.js"></script>
        <script src="./../js/request.js"></script>
        <script>
            new Vue({
                el:"#address_edit",
                data(){
                    return {
                        title:'新增收货地址',
                        form:{
                            consignee:'',//联系人
                            phone:undefined,//手机号
                            sex:'1',//0表示女 1 表示男
                            detail:'',//收货地址
                            label:'公司',//标签
                        },
                        labelList:[
                            '无','公司','家','学校'
                        ],
                        id:undefined,
                        activeIndex :0
                    }
                },
                computed:{},
                created(){
                    this.initData()
                },
                mounted(){
                },
                methods:{
                    goBack(){
                        history.go(-1)
                    },
                    async initData(){
                        const params = parseUrl(window.location.search)
                        this.id = params.id
                        if(params.id){
                            this.title = '编辑收货地址'
                            const res = await addressFindOneApi(params.id)
                            if(res.code === 1){
                                this.form = res.data
                            }else{
                                this.$notify({ type:'warning', message:res.msg});
                            }
                        }
                    },
                    async saveAddress(){
                        const form = this.form
                        if(!form.consignee){
                            this.$notify({ type:'warning', message:'请输入联系人'});
                            return 
                        }
                        if(!form.phone){
                            this.$notify({ type:'warning', message:'请输入邮箱'});
                            return 
                        }
                        if(!form.detail){
                            this.$notify({ type:'warning', message:'请输入收货地址'});
                            return 
                        }
                        const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                        if(!reg.test(form.phone)){
                            this.$notify({ type:'warning', message:'邮箱不合法'});
                            return  
                        }
                        let res= {}
                        if(this.id){
                            res = await updateAddressApi(this.form)
                        }else{
                            res = await addAddressApi(this.form)
                        }
                        
                        if(res.code === 1){
                            window.requestAnimationFrame(()=>{
                                window.location.replace('/front/page/address.html')
                            })
                        }else{
                            this.$notify({ type:'warning', message:res.msg});
                        }
                    },
                    deleteAddress(){
                        this.$dialog.confirm({
                            title: '确认删除',
                            message: '确认要删除当前地址吗？',
                        })
                        .then( async () => {
                            const res = await deleteAddressApi({ids:this.id })
                            if(res.code === 1){
                                window.requestAnimationFrame(()=>{
                                    window.location.replace('/front/page/address.html')
                                })
                            }else{
                                this.$notify({ type:'warning', message:res.msg});
                            }
                        })
                        .catch(() => {
                        });
                    },
                }
            })
            </script>
    </body>
</html>
```

填写表单，点击保存，发送请求

请求网址: http://localhost/addressBook
请求方法: POST

请求路径Wie`/addressBook`，请求方式为`POST`，那么我们在`AddressBookController`中编写对应的方法

重启服务器，测试新增地址

![image-20230729152533578](https://s2.loli.net/2023/08/14/uNoCl4rpk9JHzYm.png)

添加完之后的效果

![image-20230729152546005](https://s2.loli.net/2023/08/14/YQcRJ9Iayw3qVzb.png)

## 设置默认地址

- 先来想想怎么设置默认地址

	- 默认地址，按理说数据库中，有且仅有一条数据为默认地址，也就是`is_default`字段为1

	- 如何保证整个表中的

		```
		is_default
		```

		字段只有一条为1

		- 每次设置默认地址的时候，将当前用户所有地址的`is_default`字段设为0，随后将当前地址的`is_default`字段设为1

- 当我们点击上图的设为默认按钮的时候，会发送请求

	> 请求网址: http://localhost/addressBook/default
	> 请求方法: PUT

- 请求路径为`/addressBook/default`，请求方式为`PUT`，那么我们现在就在`AddressBookController`中编写对应的方法

注意这里的条件构造器是`LambdaUpdateWrapper`，而不是我们前面经常用的`LambdaQueryWrapper`



# 菜品展示

## 需求分析

- 用户登陆成功之后，跳转到菜品页面，根据菜品分类来展示菜品和套餐
- 如果菜品设置了口味信息，则需要展示选择规格按钮，否则只展示+按钮（这部分是前端实现的）



## 梳理交互过程

1. 页面(front/index.html)发送ajax请求，获取分类数据（菜品分类和套餐分类）
2. 页面发送ajax请求，根据具体的菜品/套餐分类，展示对应分类中的具体菜品



## 前端分析

- 启动服务器，登录账号，监测Network选项卡，发现登录到首页会发送两个请求

	- 分类

		> 请求网址: `http://localhost/category/list`
		> 请求方法: GET

	- 购物车

		> 请求网址: `http://localhost/shoppingCart/list`
		> 请求方法: GET



其中分类请求我们之前写过了，但是当我们访问页面的时候，并没有加载出来，原因我们来看看前端代码



# 菜品展示

## 需求分析

- 用户登陆成功之后，跳转到菜品页面，根据菜品分类来展示菜品和套餐
- 如果菜品设置了口味信息，则需要展示选择规格按钮，否则只展示+按钮（这部分是前端实现的）

## 梳理交互过程

1. 页面(front/index.html)发送ajax请求，获取分类数据（菜品分类和套餐分类）
2. 页面发送ajax请求，根据具体的菜品/套餐分类，展示对应分类中的具体菜品

## 前端分析

启动服务器，登录账号，监测Network选项卡，发现登录到首页会发送两个请求

- 分类

	> 请求网址: `http://localhost/category/list`
	> 请求方法: `GET`

- 购物车

	> 请求网址: `http://localhost/shoppingCart/list`
	> 请求方法: `GET`

其中分类请求我们之前写过了，但是当我们访问页面的时候，并没有加载出来，原因我们来看看前端代码

index.html

`Promise.all`在处理多个异步请求时，需要等待绑定的每个ajax请求返回数据以后才能正常显示，也就是说，当这两个请求都成功时，才会正常显示，虽然`categoryListApi`可以正常返回数据，是因为我们之前已经写过了，那时候展示的是在新增菜品的下拉框中，现在是变为显示在页面上了，但是`cartListApi`不能，看一下代码的请求路径就知道，我们还没开始写

```js
//初始化数据
initData(){
    Promise.all([categoryListApi(),cartListApi({})]).then(res=>{
    //获取分类数据
    if(res[0].code === 1){
        this.categoryList = res[0].data
        if(Array.isArray(res[0].data) && res[0].data.length > 0){
        this.categoryId = res[0].data[0].id
        if(res[0].data[0].type === 1){
            this.getDishList()
        }else{
            this.getSetmealData()
        }
        }
    }else{
        this.$notify({ type:'warning', message:res[0].msg});
    }
    //获取菜品数据
    if(res[1].code === 1){
    this.cartData = res[1].data
    }else{
        this.$notify({ type:'warning', message:res[1].msg});
    }
    })
}
```

这里是获取菜品分类

```js
//获取所有的菜品分类
function categoryListApi() {
    return $axios({
        'url': '/category/list',
        'method': 'get',
    })
}
```

我们返回的菜品集合

```java
@GetMapping("/list")
public Result<List<Dish>> get(Dish dish) {
    //条件查询器
    LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();
    //根据传进来的categoryId查询
    queryWrapper.eq(dish.getCategoryId() != null, Dish::getCategoryId, dish.getCategoryId());
    //只查询状态为1的菜品（在售菜品）
    queryWrapper.eq(Dish::getStatus, 1);
    //简单排下序
    queryWrapper.orderByAsc(Dish::getSort).orderByDesc(Dish::getUpdateTime);
    //获取查询到的结果作为返回值
    List<Dish> list = dishService.list(queryWrapper);
    return Result.success(list);
}
```

购物车相关功能还没写，所以这里我们用一个写死了的json数据骗骗它
将url换成我们注释掉的那个就好了

```js
//获取购物车内商品的集合
function cartListApi(data) {
    return $axios({
        // 'url': '/shoppingCart/list',
        // 这里做了一个模拟数据
        'url': '/front/cartData.json',
        'method': 'get',
        params:{...data}
    })
}
```

**cartData.json:**

```json
{"code":1,"msg":null,"data":[],"map":{}}
```

在更改数据后，我们发现前端上并没有挑选口味规格这样的按钮

![image-20230731094308991](https://s2.loli.net/2023/08/14/p9ZcSHQJb3dYjx1.png)

全都是一个个的+号，这是为什么呢，是因为我们的Dish实体类没有口味数据所导致的，那么这里的按钮不该是一个`+`，而应该是`选择规格`

```html
<div class="divTypes" v-if="detailsDialog.item.flavors && detailsDialog.item.flavors.length > 0 && !detailsDialog.item.number " 
@click ="chooseFlavorClick(detailsDialog.item)">选择规格</div>               
```

通过代码我们可以看出，选择规格按钮，是根据服务端返回数据中是否有flavors字段来决定的，但我们返回的是一个`List<Dish>`，其中并没有`flavors`属性，所以我们需要修改前面的方法返回值为`DishDto`，`DishDto`继承了`Dish`，且新增了`flavors`属性

## 代码开发

### 菜品分类口味

由于Dish实体类是没有口味数据的，所以我们需要改动之前的List方法

改动的思路是类似于之前的Page方法，把返回值改为DishDto，再对DishDto里的flavors属性进行设置即可

Page方法：

```java
//遍历每一条records数据
List<DishDto> list = records.stream().map((item) -> {
    DishDto dishDto = new DishDto();
    //将数据赋给dishDto对象，这里面得到了records中的每一个Dish对象
    // 然后赋值给dishDto
    BeanUtils.copyProperties(item, dishDto);

    //然后获取一下dish对象的category_id属性
    // 得到dish对象的id
    Long categoryId = item.getCategoryId();  //分类id

    //根据这个id属性，获取到Category对象（这里需要用@Autowired注入一个CategoryService对象）
    Category category = categoryService.getById(categoryId);

    // 刚开始时，有些数据是没有绑定菜品分类，就会出错
    if (category != null) {
        //随后获取Category对象的name属性，也就是菜品分类名称
        // 得到id属性，就可以根据id查询对象，并且获得对象的名字
        String categoryName = category.getName();

        //最后将菜品分类名称赋给dishDto对象就好了
        // 最后把对象的菜品分类名称赋值给disDto对象即可
        dishDto.setCategoryName(categoryName);

    }

    //结果返回一个dishDto对象
    return dishDto;

    //并将dishDto对象封装成一个集合，作为我们的最终结果，这个集合，就是要展示的新数据
}).collect(Collectors.toList());
```

改动后的方法

```java
@GetMapping("/list")
// 先将返回值类型改为List<DishDto>
public Result<List<DishDto>> list(Dish dish){
    LambdaQueryWrapper<Dish> queryWrapper = new LambdaQueryWrapper<>();
    // 得到该菜品项对应的菜品
    queryWrapper.eq(dish.getCategoryId() != null,Dish::getCategoryId,dish.getCategoryId());

    // 添加条件，查询状态为1（起售状态）的菜品
    queryWrapper.eq(Dish::getStatus,1);

    //添加排序条件(先按照sort来排序，如果sort相同，再按照更新时间来排序)
    queryWrapper.orderByAsc(Dish::getSort).orderByDesc(Dish::getUpdateTime);

    List<Dish> list = dishService.list(queryWrapper);

    List<DishDto> dishDtoList = list.stream().map((item) -> {
        DishDto dishDto = new DishDto();
        BeanUtils.copyProperties(item,dishDto);
        // 分类id
        Long categoryId = item.getCategoryId();
        // 根据Id查询分类对象
        Category category = categoryService.getById(categoryId);

        if (category != null){
            // 如果分类对象查询到了，说明该菜品有分类
            String categoryName = category.getName();
            // 就让菜品设置一下这个分类对象名字
            dishDto.setCategoryName(categoryName);
        }

        // 得到菜品的id
        Long itemId = item.getId();

        // 在口味表里面查询
        LambdaQueryWrapper<DishFlavor> wrapper = new LambdaQueryWrapper<>();
        // 查找与当前菜品id相同的口味信息
        wrapper.eq(DishFlavor::getDishId,itemId);
        List<DishFlavor> flavors = dishFlavorService.list(wrapper);
        // 设置菜品口味
        dishDto.setFlavors(flavors);
        return dishDto;
    }).collect(Collectors.toList());
    return Result.success(dishDtoList);
}
```

最后我们来测试一下：

<img src="https://s2.loli.net/2023/08/14/r63NjUGcqFgsfIb.png" alt="image-20230731101037453" style="zoom:50%;" />

<img src="https://s2.loli.net/2023/08/14/mVJaw2gGCMRfnvY.png" alt="image-20230731101112900" style="zoom:50%;" />

此时这里就有选择规格按钮了

<img src="https://s2.loli.net/2023/08/14/QBEPAaLOgeKFuwv.png" alt="image-20230731101235788" style="zoom:50%;" />

在页面上也能看得到数据了，说明完成了

虽然完成了，但是当我们点击其他的时候

<img src="https://s2.loli.net/2023/08/14/vLAE6yoxsumgTCR.png" alt="image-20230731101716418" style="zoom: 67%;" /> 

发现这里出现了一个问题，404异常，我们去到控制台看一下

<img src="https://s2.loli.net/2023/08/14/SIR9WlTqkAfiQ5E.png" alt="image-20230731101826241" style="zoom: 50%;" />

这里是一个套餐，没有显示出来，我们并没有给套餐书写对应的list方法，所以它找不到对应的口味，写法其实和菜品分类口味没什么区别，这里相当于复盘一下

### 套餐分类口味

这里是一个GET请求，请求的地址是/setmeal/list，并携带了两个参数

```java
@GetMapping("/list")
public Result<List<SetmealDto>> list(Setmeal setmeal){
    LambdaQueryWrapper<Setmeal> queryWrapper = new LambdaQueryWrapper<>();
    // 得到该套餐项对应的菜品
    queryWrapper.eq(setmeal.getCategoryId() != null,Setmeal::getCategoryId,setmeal.getCategoryId());

    // 添加条件，查询状态为1（起售状态）的菜品
    queryWrapper.eq(Setmeal::getStatus,1);

    //添加排序条件(按照更新时间来排序)
    queryWrapper.orderByDesc(Setmeal::getUpdateTime);

    List<Setmeal> list = setMealService.list(queryWrapper);

    List<SetmealDto> setmealDtoList = list.stream().map((item) -> {
        SetmealDto setmealDto = new SetmealDto();
        BeanUtils.copyProperties(item,setmealDto);
        // 分类id
        Long categoryId = item.getCategoryId();
        // 根据Id查询分类对象
        Category category = categoryService.getById(categoryId);

        if (category != null){
            // 如果分类对象查询到了，说明该套餐有分类
            String categoryName = category.getName();
            // 就让套餐设置一下这个分类对象名字
            setmealDto.setCategoryName(categoryName);
        }

        // 得到套餐的id
        Long itemId = item.getId();

        LambdaQueryWrapper<SetmealDish> wrapper = new LambdaQueryWrapper<>();
        // 查找与当前套餐id相同的口味信息
        wrapper.eq(SetmealDish::getDishId,itemId);
        List<SetmealDish> flavors = setmealDishService.list(wrapper);
        // 设置菜品口味
        setmealDto.setSetmealDishes(flavors);
        return setmealDto;
    }).collect(Collectors.toList());
    return Result.success(setmealDtoList);
}
```

跟之前的代码差别不大， 就是复制过来修改一下即可

然后我们重启一下服务器

<img src="https://s2.loli.net/2023/08/14/rtVM9luSnXbcq2B.png" alt="image-20230731103219327" style="zoom:50%;" />

发现这里的数据回显了，但是没有口味,我们再去NetWork那地方看看

![image-20230731103338772](https://s2.loli.net/2023/08/14/dXY3SGCBFt7Wnor.png)

这里发现数据回显了，但是没有口味（套餐基本上都是包括一整份了，所以没有菜品口味之说）



# 购物车

## 需求分析

移动端的用户可以将菜品或者套餐添加到购物车。对于菜品来说，如果设置了口味信息，则需要选择规格才能加入购物车;对于套餐来说，可以直接点击+号将当前套餐加入购物车。在购物车里中可以修改菜品和套餐的数量，也可以清空购物车。

## 数据模型

|    Field    |     Type      | Collation | Null | Key  | Default | Comment  |
| :---------: | :-----------: | :-------: | :--: | :--: | :-----: | :------: |
|     id      |    bigint     |  (NULL)   |  NO  | PRI  | (NULL)  |   主键   |
|    name     |  varchar(50)  | utf8_bin  | YES  |      | (NULL)  |   名称   |
|    image    | varchar(100)  | utf8_bin  | YES  |      | (NULL)  |   图片   |
|   user_id   |    bigint     |  (NULL)   |  NO  |      | (NULL)  |   主键   |
|   dish_id   |    bigint     |  (NULL)   | YES  |      | (NULL)  |  菜品id  |
| setmeal_id  |    bigint     |  (NULL)   | YES  |      | (NULL)  |  套餐id  |
| dish_flavor |  varchar(50)  | utf8_bin  | YES  |      | (NULL)  |   口味   |
|   number    |      int      |  (NULL)   |  NO  |      |    1    |   数量   |
|   amount    | decimal(10,2) |  (NULL)   |  NO  |      | (NULL)  |   金额   |
| create_time |   datetime    |  (NULL)   | YES  |      | (NULL)  | 创建时间 |

## 梳理交互过程

1. 点击加入购物车按钮，页面发送ajax请求，请求服务端，将菜品/套餐添加到购物车
2. 点击购物车图标，页面发送ajax请求，请求服务端，查询购物车中的菜品和套餐
3. 点击清空购物车按钮，页面发送ajax请求，请求服务端来执行清空购物车操作

## 准备工作

实体类`ShoppingCart`

```java
/**
 * 购物车
 */
@Data
public class ShoppingCart implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    //名称
    private String name;

    //用户id
    private Long userId;

    //菜品id
    private Long dishId;

    //套餐id
    private Long setmealId;

    //口味
    private String dishFlavor;

    //数量
    private Integer number;

    //金额
    private BigDecimal amount;

    //图片
    private String image;

    private LocalDateTime createTime;
}
```

Mapper接口`ShoppingCartMapper`

```java
@Mapper
public interface ShoppingCartMapper extends BaseMapper<ShoppingCart> {
}
```

业务层接口`ShoppingCartService`

```java
public interface ShoppingCartService extends IService<ShoppingCart> {
}
```

业务层实现类`ShoppingCartServiceImpl`

```java
@Service
public class ShoppingCartServiceImpl extends ServiceImpl<ShoppingCartMapper, ShoppingCart> implements ShoppingCartService {
}
```

控制层`ShoppingCartController`

```java
@RestController
@Slf4j
@RequestMapping("/shoppingCart")
public class ShoppingCartController {
    @Autowired
    private ShoppingCartService shoppingCartService;
}
```

## 代码开发

### 加入购物车

在点击加入购物车后，发送了一个`POST`请求，请求地址为`shoppingCart/add`

![image-20230731145101091](https://s2.loli.net/2023/08/14/W5fy4tcS2gi6Le9.png)

我们先来测试一下是否能接收到数据

```java
@PostMapping("/add")
public Result<ShoppingCart> add(@RequestBody ShoppingCart shoppingCart){
    log.info(shoppingCart.toString());
    return null;
}
```

![image-20230731145713414](https://s2.loli.net/2023/08/14/qCU9ruATpy5IBFD.png)

在控制台这边查看后，发现已经得到了数据，说明可以接收，参数也没有什么问题

编写代码

```java
@PostMapping("/add")
public Result<ShoppingCart> add(@RequestBody ShoppingCart shoppingCart){
    log.info(shoppingCart.toString());
    // 得到当前用户的id
    Long currentId = BaseContext.getCurrentId();
    shoppingCart.setUserId(currentId);

    // 获取当前菜品id(就是当前添加进来的菜品id)
    Long dishId = shoppingCart.getDishId();

    LambdaQueryWrapper<ShoppingCart> queryWrapper = new LambdaQueryWrapper<>();
    // 判断添加的是菜品还是套餐
    if (dishId != null){
        // 如果菜品id不为空，说明传入的是菜品，反之是套餐
        // 并判断数据库中是否有菜品id
        queryWrapper.eq(ShoppingCart::getDishId,dishId);
    }
    else{
        // 判断数据中是否有这个套餐id
        queryWrapper.eq(ShoppingCart::getSetmealId,shoppingCart.getSetmealId());
    }

    // 查询菜品或套餐是否存在于购物车中
    ShoppingCart cart = shoppingService.getOne(queryWrapper);
    // 存在于购物车中
    if (cart != null){
        // 得到数量
        Integer number = cart.getNumber();
        cart.setNumber(number+1);
        shoppingService.updateById(cart);
    }else{
        // 不存在，就需要为当前购物车设置创建时间，因为它没有给默认值,并插入到数据库中
        shoppingCart.setCreateTime(LocalDateTime.now());
        // 不存在，就需要为当前购物车设置数量
        shoppingCart.setNumber(1);
        shoppingService.save(shoppingCart);
        cart = shoppingCart;
    }
    return Result.success(cart);
}
```

- 功能测试

	重启服务器，尝试添加购物车，随后去数据库中查询是否有对应数据

### 查看购物车

之前为了不报错，我们将查看购物车的地址换成了一个死数据
那现在我们要做的就是换成真数据

```js
//获取购物车内商品的集合
function cartListApi(data) {
    return $axios({
        'url': '/shoppingCart/list',
        //'url': '/front/cartData.json',
        'method': 'get',
        params: {...data}
    })
}
```

请求路径为`/shoppingCart/list`，请求方式为`GET`
直接来`ShoppingCartController`中添加对应的方法

```java
@GetMapping("/list")
public Result<List<ShoppingCart>> list(){
    LambdaQueryWrapper<ShoppingCart> queryWrapper = new LambdaQueryWrapper<>();
    // 使用数据库中的userId和当前登录的用户Id比较来查看购物车
    queryWrapper.eq(ShoppingCart::getUserId,BaseContext.getCurrentId());
    // 将查询到的数据呈现在购物车中
    List<ShoppingCart> list = shoppingService.list(queryWrapper);
    return Result.success(list);
}
```

重启服务器测试一下

如果没出来，说明有缓存，ctrl+F5刷新一下缓存就好了

如果一切顺利的话，就可以看到数据了，不过减号的功能我们没写，后面复盘再补上

<img src="https://s2.loli.net/2023/08/14/CDtGc7mV9KyeXUH.png" alt="image-20230731160323810" style="zoom:50%;" />

### 清空购物车

我们点击上图中的清空按钮，请求路径为`/shoppingCart/clean`，请求方式为`DELETE`

> 请求网址: `http://localhost/shoppingCart/clean`
> 请求方法: `DELETE`

清空购物车的逻辑倒是比较简单，获取用户id，然后去`shopping__cart`表中删除对应id的数据即可
那么我们现在就来`ShoppingCartController`中编写对应的方法

```java
@DeleteMapping("/clean")
public Result<String> delete(){
    // 获取当前用户id，根据用户id去ShoppingCart表里面删除所有数据即可
    Long currentId = BaseContext.getCurrentId();
    // 查询当前用户id的数据
    LambdaQueryWrapper<ShoppingCart> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(ShoppingCart::getUserId,currentId);
    shoppingService.remove(queryWrapper);
    return Result.success("成功清空购物车");
}
```



# 用户下单

## 需求分析

移动端用户将菜品或者套餐加入购物车后，可以点击购物车中的去结算按钮，页面跳转到订单确认页面，点击去支付按钮，完成下单操作

## 数据模型

用户下单业务对应的数据表为`orders`表和`order_detail`表

`orders`表主要是描述用户的订单信息

`order_detail`表是你买了什么什么对象，这样的一个概括，是一个订单明细表

- `orders`表

|      Field      |     Type      | Collation | Null | Key  | Default |                       Comment                        |
| :-------------: | :-----------: | :-------: | :--: | :--: | :-----: | :--------------------------------------------------: |
|       id        |    bigint     |  (NULL)   |  NO  | PRI  | (NULL)  |                         主键                         |
|     number      |  varchar(50)  | utf8_bin  | YES  |      | (NULL)  |                        订单号                        |
|     status      |      int      |  (NULL)   |  NO  |      |    1    | 订单状态 1待付款，2待派送，3已派送，4已完成，5已取消 |
|     user_id     |    bigint     |  (NULL)   |  NO  |      | (NULL)  |                       下单用户                       |
| address_book_id |    bigint     |  (NULL)   |  NO  |      | (NULL)  |                        地址id                        |
|   order_time    |   datetime    |  (NULL)   |  NO  |      | (NULL)  |                       下单时间                       |
|  checkout_time  |   datetime    |  (NULL)   |  NO  |      | (NULL)  |                       结账时间                       |
|   pay_method    |      int      |  (NULL)   |  NO  |      |    1    |                支付方式 1微信,2支付宝                |
|     amount      | decimal(10,2) |  (NULL)   |  NO  |      | (NULL)  |                       实收金额                       |
|     remark      | varchar(100)  | utf8_bin  | YES  |      | (NULL)  |                         备注                         |
|      phone      | varchar(255)  | utf8_bin  | YES  |      | (NULL)  |                        手机号                        |
|     address     | varchar(255)  | utf8_bin  | YES  |      | (NULL)  |                         地址                         |
|    user_name    | varchar(255)  | utf8_bin  | YES  |      | (NULL)  |                        用户名                        |
|    consignee    | varchar(255)  | utf8_bin  | YES  |      | (NULL)  |                        收货人                        |

- `order_detail`表

|    Field    |     Type      | Collation | Null | Key  | Default | Comment |
| :---------: | :-----------: | :-------: | :--: | :--: | :-----: | :-----: |
|     id      |    bigint     |  (NULL)   |  NO  | PRI  | (NULL)  |  主键   |
|    name     |  varchar(50)  | utf8_bin  | YES  |      | (NULL)  |  名字   |
|    image    | varchar(100)  | utf8_bin  | YES  |      | (NULL)  |  图片   |
|  order_id   |    bigint     |  (NULL)   |  NO  |      | (NULL)  | 订单id  |
|   dish_id   |    bigint     |  (NULL)   | YES  |      | (NULL)  | 菜品id  |
| setmeal_id  |    bigint     |  (NULL)   | YES  |      | (NULL)  | 套餐id  |
| dish_flavor |  varchar(50)  | utf8_bin  | YES  |      | (NULL)  |  口味   |
|   number    |      int      |  (NULL)   |  NO  |      |    1    |  数量   |
|   amount    | decimal(10,2) |  (NULL)   |  NO  |      | (NULL)  |  金额   |

## 梳理交互过程

1. 在购物车中点击去结算按钮，页面跳转到订单确认页面
2. 在订单确认页面中，发送ajax请求，请求服务端，获取当前登录用户的默认地址
3. 在订单确认页面，发送ajax请求，请求服务端，获取当前登录用户的购物车数据
4. 在订单确认页面点击去支付按钮，发送ajax请求，请求服务端，完成下单操作



## 准备工作

实体类`Orders`和`OrderDetail`

```java
/**
 * 订单
 */
@Data
public class Orders implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    //订单号
    private String number;

    //订单状态 1待付款，2待派送，3已派送，4已完成，5已取消
    private Integer status;


    //下单用户id
    private Long userId;

    //地址id
    private Long addressBookId;


    //下单时间
    private LocalDateTime orderTime;


    //结账时间
    private LocalDateTime checkoutTime;


    //支付方式 1微信，2支付宝
    private Integer payMethod;


    //实收金额
    private BigDecimal amount;

    //备注
    private String remark;

    //用户名
    private String userName;

    //手机号
    private String phone;

    //地址
    private String address;

    //收货人
    private String consignee;
}
```

```java
/**
 * 订单明细
 */
@Data
public class OrderDetail implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    //名称
    private String name;

    //订单id
    private Long orderId;


    //菜品id
    private Long dishId;


    //套餐id
    private Long setmealId;


    //口味
    private String dishFlavor;


    //数量
    private Integer number;

    //金额
    private BigDecimal amount;

    //图片
    private String image;
}
```

Mapper接口`OrderMapper`、`OrderDetailMapper`

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.eastwind.entity.Orders;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper extends BaseMapper<Orders> {
}
```

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.eastwind.entity.OrderDetail;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderDetailMapper extends BaseMapper<OrderDetail> {
}
```

业务层接口`OrderService`、`OrderDetailService`

```java
import com.baomidou.mybatisplus.extension.service.IService;
import com.eastwind.entity.Orders;

public interface OrderService extends IService<Orders> {
}
```

```java
import com.baomidou.mybatisplus.extension.service.IService;
import com.eastwind.entity.OrderDetail;

public interface OrderDetailService extends IService<OrderDetail> {
}
```

业务层接口实现类`OrderServiceImpl`、`OrderDetailServiceImpl`

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.Orders;
import com.eastwind.mapper.OrderMapper;
import com.eastwind.service.OrderService;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Orders> implements OrderService {
}
```

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.eastwind.entity.OrderDetail;
import com.eastwind.mapper.OrderDetailMapper;
import com.eastwind.service.OrderDetailService;
import org.springframework.stereotype.Service;

@Service
public class OrderDetailServiceImpl extends ServiceImpl<OrderDetailMapper, OrderDetail> implements OrderDetailService {
}
```

控制层`OrderController`、`OrderDetailController`

```java
import com.eastwind.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private OrderService orderService;
}
```

```java
import com.eastwind.service.OrderDetailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/orderDetail")
public class OrderDetailController {
    @Autowired
    private OrderDetailService orderDetailService;
}
```

<img src="https://s2.loli.net/2023/08/14/CjcM1fAGTRISHYX.png" alt="image-20230731182917074" style="zoom:50%;" />

在点击去支付之后，发送了一个`POST`请求，请求地址为`order/submit`

![image-20230731183103540](https://s2.loli.net/2023/08/14/bKyGPnmzTkdjIHV.png)

查看一下会得到的数据

- `addressBookId`：地址的Id

- payMethod:付款的方式

- remark：备注

	<img src="https://s2.loli.net/2023/08/14/xtkIMTZyiYRH3nh.png" alt="image-20230731183208200" style="zoom:50%;" />

这时候可能会有疑惑，怎么就传递了这几个数据

这是因为我们登录后就可以得到当前用户的id，能拿到id就能根据id去购物车里面找数据

## 代码开发

具体的`submit`方法我们放在`OrderService`写，`OrderController`调用写好的`submit`方法就好了

编写具体的submit方法的逻辑代码，先分析一下下单功能，都需要做什么事情

- 获取当前用户id
- 根据用户id查询其购物车数据
- 将查询到的购物车数据，插入到订单表中（1条）
- 将查询到的购物车数据，插入到订单明细表中（多条）
- 清空购物车

```java
@PostMapping("/submit")
public Result<String> submit(@RequestBody Orders orders){
    log.info(orders.toString());
    orderService.submit(orders);
    return Result.success("用户下单成功");
}
```

```java
import com.baomidou.mybatisplus.extension.service.IService;
import com.eastwind.entity.Orders;

public interface OrderService extends IService<Orders> {
    void submit(Orders orders);
}
```

```java
@Service
@Transactional
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Orders> implements OrderService {

    @Autowired
    private ShoppingService shoppingCartService;

    @Autowired
    private UserService userService;

    @Autowired
    private AddressBookService addressBookService;

    @Autowired
    private OrderDetailService orderDetailService;

    @Override
    public void submit(Orders orders) {
        //获取当前用户id
        Long userId = BaseContext.getCurrentId();
        //条件构造器
        LambdaQueryWrapper<ShoppingCart> shoppingCartLambdaQueryWrapper = new LambdaQueryWrapper<>();
        //根据当前用户id查询其购物车数据
        shoppingCartLambdaQueryWrapper.eq(userId != null, ShoppingCart::getUserId, userId);
        List<ShoppingCart> shoppingCarts = shoppingCartService.list(shoppingCartLambdaQueryWrapper);
        //判断一下购物车是否为空
        if (shoppingCarts == null) {
            throw new CustomException("购物车数据为空，不能下单");
        }
        //判断一下地址是否有误
        Long addressBookId = orders.getAddressBookId();
        AddressBook addressBook = addressBookService.getById(addressBookId);
        if (addressBookId == null) {
            throw new CustomException("地址信息有误，不能下单");
        }
        //获取用户信息，为了后面赋值
        User user = userService.getById(userId);
        // 得到一个随机的订单id
        long orderId = IdWorker.getId();
        AtomicInteger amount = new AtomicInteger(0);
        //向订单细节表插入多条数据
        List<OrderDetail> orderDetailList= shoppingCarts.stream().map((item) -> {
            // new一个订单明细数据,将订单明细的数据放进去
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrderId(orderId);
            orderDetail.setName(item.getName());
            orderDetail.setImage(item.getImage());
            orderDetail.setDishId(item.getDishId());
            orderDetail.setSetmealId(item.getSetmealId());
            orderDetail.setDishFlavor(item.getDishFlavor());
            orderDetail.setNumber(item.getNumber());
            orderDetail.setAmount(item.getAmount());
            // 对所有数据进行累加，计算总金额
            amount.addAndGet(item.getAmount().multiply(new BigDecimal(item.getNumber())).intValue());

            return orderDetail;
        }).collect(Collectors.toList());

        //向订单表插入一条数据
        orders.setId(orderId);
        orders.setNumber(String.valueOf(orderId));
        orders.setStatus(2);
        orders.setUserId(userId);
        orders.setAddressBookId(addressBookId);
        orders.setOrderTime(LocalDateTime.now());
        orders.setCheckoutTime(LocalDateTime.now());
        orders.setAmount(new BigDecimal(amount.get()));
        orders.setPhone(addressBook.getPhone());
        orders.setUserName(user.getName());
        orders.setConsignee(addressBook.getConsignee());
        orders.setAddress(
                (addressBook.getProvinceName() == null ? "":addressBook.getProvinceName())+
                        (addressBook.getCityName() == null ? "":addressBook.getCityName())+
                        (addressBook.getDistrictName() == null ? "":addressBook.getDistrictName())+
                        (addressBook.getDetail() == null ? "":addressBook.getDetail())
        );

        //根据查询到的购物车数据，对订单表插入数据（1条）
        super.save(orders);
        //根据查询到的购物车数据，对订单明细表插入数据（多条）
        orderDetailService.saveBatch(orderDetailList);
        //清空购物车数据
        shoppingCartService.remove(shoppingCartLambdaQueryWrapper);
    }
}
```

重启服务器，测试结算按钮，看到如下页面就说明大功告成啦

<img src="https://s2.loli.net/2023/08/14/n6khPpguNqJjl7Q.png" alt="image-20230731194028338" style="zoom:50%;" />

后面再对之前的功能开始进行补充


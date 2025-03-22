---
title: 数据结构与算法
abbrlink: 4b0178e0
date: 2024-03-20 15:08:25
tags: 算法
description: 数据结构与算法的学习
---

#  线性结构和非线性结构

数据结构包括：线性结构和非线性结构

1. 线性结构作为最常用的数据结构，其特点是数据元素之间存在一对一的线性关系
2. 线性结构有两种不同的存储结构，即顺序存储结构和链式存储结构。顺序存储的线性表称为顺序表，顺序表中的存储元素是连续的
3. 链式存储的线性表称为链表，链表中的存储元素不一定是连续的，元素节点中存放数据元素以及相邻元素的地址信息
4. 线性结构常见的有：数组、队列、链表和栈

非线性结构包括：二维数组，多维数组，广义表，树结构，图结构

## 稀疏数组

### 应用场景

编写的五子棋程序中，有存盘退出和续上盘的功能

<img src="https://s2.loli.net/2024/03/20/Zu24Ck89HpjaiOg.png" alt="image-20240320152727613" style="zoom:50%;" />

分析问题：

因为该二维数组的很多值默认是0，因此记录了很多没有意义的数据->稀疏数组

### 基本介绍

当一个数组中大部分元素为0，或者为同一个值的数组时，可以使用稀疏数组来保存该数组

稀疏数组的处理方法是：

1. 记录数组一共有几行几列，有多少个不同的值
2. 把具有不同值的元素的行列及值记录在一个小规模的数组中，从而缩小程序的规模

<img src="https://s2.loli.net/2024/03/20/9XTIobliCk7VnuD.png" style="zoom:50%;" />

这个小规模的数组中，第一行表示几行，几列，几个有效数据

**除了第一行以外的**，第一列表示行，第二列表示列，第三列表示值

通过稀疏数组，达到了压缩的效果

### 稀疏数组转换过程

<img src="https://s2.loli.net/2024/03/20/ij6oGqnTeQlIEFx.png" alt="image-20240320154941955" style="zoom:50%;" />

二维数组转稀疏数组的思路

1. 遍历原始的二维数组，得到有效数据的个数sum
2. 根据sum就可以创建稀疏数组`sparseArr int[sum+1][3]`
3. 将二维数组的有效数组存入稀疏数组

稀疏数组转原始的二维数组的思路

1. 想读取稀疏数组的第一行，根据第一行的数据，创建原始的二维数组，比如`chessArr2 = int[11][11]`
2. 在读取稀疏数组后几行数据，并赋给二维数组即可

### 代码实现

```java
public class forStudy {
    public static void main(String[] args) {
        // 创建一个原始的二维数组11*11
        // 0:表示没有棋子,1表示黑子,2表示蓝子
        int chessArr[][] = new int[11][11];
        chessArr[1][2] = 1;
        chessArr[2][3] = 2;
        // 输出原始的二维数组
        System.out.println("原始的二维数组");
        for (int[] ints : chessArr) {
            for (int anInt : ints) {
                System.out.printf("%d\t",anInt);
            }
            System.out.println();
        }
        // 将二维数组转为稀疏数组
        // 想遍历二维数组,得到非零数据的个数
        int sum = 0;
        for (int i = 0; i < 11; i++) {
            for (int j = 0; j < 11; j++) {
                if (chessArr[i][j] != 0){
                    sum ++;
                }
            }
        }
        // 创建对应的稀疏数组
        int sparseArr[][] = new int[sum + 1][3];
        // 给稀疏数组赋值
        sparseArr[0][0] = 11;
        sparseArr[0][1] = 11;
        sparseArr[0][2] = sum;
        int count = 0;      // 记录是第几个非0数据
        for (int i = 0; i < 11; i++) {
            for (int j = 0; j < 11; j++) {
                if (chessArr[i][j] != 0){
                    count ++;
                    sparseArr[count][0] = i;
                    sparseArr[count][1] = j;
                    sparseArr[count][2] = chessArr[i][j];
                }
            }
        }
        // 输出稀疏数组的形式
        System.out.println();
        System.out.println("得到的稀疏数组为----------");
        for (int[] ints : sparseArr) {
            System.out.printf("%d\t%d\t%d\t",ints[0],ints[1],ints[2]);
            System.out.println();
        }

        // 将稀疏数组-->恢复成原始的二维数组
        // 先读取稀疏数组的第一行,根据第一行的数据,创建原始的二维数组,比如上面的chessArr = int[x][y]
        // 再读取稀疏数组后几行的数据,赋值给原始的二维数组即可
        int chessArr2[][] = new int[sparseArr[0][0]][sparseArr[0][1]];

        for (int i = 1; i < sparseArr[0][2]+1; i++) {
            chessArr2[sparseArr[i][0]][sparseArr[i][1]] = sparseArr[i][2];
        }
        for (int[] ints : chessArr2) {
            for (int anInt : ints) {
                System.out.printf("%d\t",anInt);
            }
            System.out.println();
        }
    }
}
```

### 练习

要求：

在前面的基础上，将稀疏数组保存在磁盘上，比如map.data

恢复原来的数组时，读取map.data进行恢复

## 队列

### 基本介绍

- 队列是一个有序列表，可以用数组或链表来实现
- 遵循**先进先出**的原则。即：先存入队列的数据，要先取出。后存入的要后取出
- 示意图：（使用数组模拟队列示意图）

![image-20240321131500134](https://s2.loli.net/2024/03/21/RYLl6KFHbO4MNAn.png)

### 数组模拟队列

- 队列本身是有序列表，若使用数组的结构来存储队列的数据，则队列数组的声明如基本介绍中的示意图，其中maxSize是该队列的最大容量。
- 因为队列的输出、输入是分别从前后端来处理，因此需要两个变量front及rear分别记录队列前后端的下标，front会随着数据输出而改变，而rear则是随着数据输入而改变

#### 思路分析

当我们将数据存入队列时称`addQueue`，addQueue的处理需要有两个步骤：思路分析

1. 将尾指针往后移：rear+1，当front==rear【空】
2. 当尾指针小于队列的最大下标maxSize - 1，则将数据存入rear所指的数组元素中，否则无法存入数据。rear == maxSize - 1【队列满】

### 代码实现

```java
import java.util.Scanner;

public class StudyArrayQueue {
    public static void main(String[] args) {
        // 测试
        // 创建一个队列
        ArrayQueue arrayQueue = new ArrayQueue(3);
        char key = ' ';     // 接收用户输入
        boolean loop = true;
        Scanner scanner = new Scanner(System.in);
        // 输出一个菜单
        while (loop) {
            System.out.println("s(show):显示队列");
            System.out.println("e(exit):退出程序");
            System.out.println("a(add):添加数据到队列");
            System.out.println("g(get):从队列取出数据");
            System.out.println("h(head):查看队列头数据");
            key = scanner.next().charAt(0);   // 接收一个字符
            switch (key) {
                case 's':
                    // 显示队列
                   try {
                       arrayQueue.showQueue();
                   }catch (Exception e){
                       System.out.println(e.getMessage());
                   }
                    break;
                case 'e':
                    // 退出程序
                    scanner.close();
                    loop = false;
                    break;
                case 'a':
                    System.out.println("输出一个数");
                    int value = scanner.nextInt();
                    arrayQueue.addQueue(value);
                    break;
                case 'g':
                    // 取出数据
                    try {
                        int res = arrayQueue.getQueue();
                        System.out.println("取出的数据"+res);
                    }catch (Exception e){
                        System.out.println(e.getMessage());
                    }
                    break;
                case 'h':
                    // 查看头数据
                    try {
                        int res = arrayQueue.headQueue();
                        System.out.println("头部的数据"+res);
                    }catch (Exception e){
                        System.out.println(e.getMessage());
                    }
                    break;
            }
        }
        System.out.println("程序退出");
    }
}

// 使用数组模拟队列-编写一个ArrayQueue类
class ArrayQueue {
    private int maxSize;        // 表示数组的最大容量
    private int front;  // 队列头
    private int rear;   // 队列尾
    private int[] arr;  // 该数据用于存放数据,模拟队列

    // 创建队列的构造器
    public ArrayQueue(int arrMaxsize) {
        maxSize = arrMaxsize;
        arr = new int[maxSize];
        front = -1;        // 指向队列头部,分析出front是指向队列头的前一个位置
        rear = -1;          // 指向队列尾,指向队列尾的数据(即就是队列最后一个数据)
    }

    // 判断队列是否满
    public boolean isFull() {
        return rear == maxSize - 1;
    }

    // 判断队列是否为空
    public boolean isEmpty() {
        return rear == front;
    }

    // 添加数据到队列
    public void addQueue(int n) {
        // 判断队列是否满
        if (isFull()) {
            System.out.println("队列满,无法加入数据");
            return;
        }
        rear++;   // 让rear后移
        // 将数据插入到第一位
        arr[rear] = n;
    }

    // 出队列
    public int getQueue() {
        // 判断队列是否为空
        if (isEmpty()) {
            // 抛出异常
            throw new RuntimeException("队列为空,无法获取数据");
        }
        front++;
        return arr[front];
    }

    // 显示队列所有数据
    public void showQueue() {
        // 如果队列为空,输出
        if (isEmpty()) {
            throw new RuntimeException("队列为空");
        }
        for (int i = 0; i < arr.length; i++) {
            System.out.printf("arr[%d]=%d\n", i, arr[i]);
        }
    }

    // 显示队列的头数据是多少（不是取出数据）
    public int headQueue() {
        // 判断是否为空
        if (isEmpty()) {
            // 不存在头数据
            throw new RuntimeException("队列为空");
        }
        return arr[front + 1];
    }
}
```

### 问题分析及优化

1. 目前数组使用一次就不能用了，没有达到复用的效果
2. 将这个数组使用算法，改进成环形数组

### 数组模拟环形队列

#### 思路分析

1. front变量的含义做一个调整：front就指向队列的第一个元素，也就是说arr[front]就是队列的第一个元素

	front 的初始值 = 0

2. rear变量的含义做一个调整：rear指向队列的最后一个元素的后一个位置。因为希望空出一个空间作为约定，rear的初始值 = 0

3. 当队列满时，条件是(rear + 1) % maxSize = front【满】

4. 当队列为空的条件，rear == front 空

5. 当我们这样分析，队列中有效的数据的个数(rear + maxSize - front) % maxSize  

	设rear = 1,front = 0,maxSize = 3,此时有效个数为(rear + maxSize - front) % maxSize = (1 + 3 - 0) % 3 =  1,此时有效数据个数为1

6. 我们就可以在原来的队列上修改得到一个环形队列

#### 代码实现

```java
import java.util.Scanner;

public class CircleArrayQueue {
    public static void main(String[] args) {
        System.out.println("测试数组模拟环形队列");
        CircleArray arrayQueue = new CircleArray(4);    // 这里设置的4,其队列的有效数据最大为3
        char key = ' ';     // 接收用户输入
        boolean loop = true;
        Scanner scanner = new Scanner(System.in);
        // 输出一个菜单
        while (loop) {
            System.out.println("s(show):显示队列");
            System.out.println("e(exit):退出程序");
            System.out.println("a(add):添加数据到队列");
            System.out.println("g(get):从队列取出数据");
            System.out.println("h(head):查看队列头数据");
            key = scanner.next().charAt(0);   // 接收一个字符
            switch (key) {
                case 's':
                    // 显示队列
                    try {
                        arrayQueue.showQueue();
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                    break;
                case 'e':
                    // 退出程序
                    scanner.close();
                    loop = false;
                    break;
                case 'a':
                    System.out.println("输出一个数");
                    int value = scanner.nextInt();
                    arrayQueue.addQueue(value);
                    break;
                case 'g':
                    // 取出数据
                    try {
                        int res = arrayQueue.getQueue();
                        System.out.println("取出的数据" + res);
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                    break;
                case 'h':
                    // 查看头数据
                    try {
                        int res = arrayQueue.headQueue();
                        System.out.println("头部的数据" + res);
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                    break;
            }
        }
        System.out.println("程序退出");
    }
}

// 使用数组模拟队列-编写一个ArrayQueue类
class CircleArray {
    private int maxSize;        // 表示数组的最大容量
    private int front;  // 队列头,指向队列第一个元素arr[front],初始值为0
    private int rear;   // 队列尾,指向队列最后一个元素的后一个位置,初始值为0
    private int[] arr;  // 该数据用于存放数据,模拟队列

    // 创建队列的构造器
    public CircleArray(int arrMaxsize) {
        maxSize = arrMaxsize;
        arr = new int[maxSize];
        // int 默认值为0,可以不写
//        front = 0;
//        rear = 0;
    }

    // 判断队列是否满
    public boolean isFull() {
        return (rear + 1) % maxSize == front;
    }

    // 判断队列是否为空
    public boolean isEmpty() {
        return rear == front;
    }

    // 添加数据到队列
    public void addQueue(int n) {
        // 判断队列是否满
        if (isFull()) {
            System.out.println("队列满,无法加入数据");
            return;
        }
        arr[rear] = n;
        rear = (rear + 1) % maxSize;
    }

    // 出队列
    public int getQueue() {
        // 判断队列是否为空
        if (isEmpty()) {
            // 抛出异常
            throw new RuntimeException("队列为空,无法获取数据");
        }
        // front 是指向队列的第一个元素
        // 想将front 对应的值保存到一个临时变量
        // 先将front后移
        // 再将临时变量返回
        int value = arr[front];
        front = (front + 1) % maxSize;
        return value;
    }

    // 显示队列所有数据
    public void showQueue() {
        // 如果队列为空,输出
        if (isEmpty()) {
            throw new RuntimeException("队列为空");
        }
        // 思路:从front开始遍历,遍历多少个元素
        for (int i = front; i < front + size(); i++) {
            System.out.printf("arr[%d]=%d\n", i % maxSize, arr[i % maxSize]);
        }
    }

    // 求出当前队列的有效个数
    public int size() {
        return (rear + maxSize - front) % maxSize;
    }

    // 显示队列的头数据是多少（不是取出数据）
    public int headQueue() {
        // 判断是否为空
        if (isEmpty()) {
            // 不存在头数据
            throw new RuntimeException("队列为空");
        }
        return arr[front];
    }
}
```

## 链表

链表是有序的列表，它在内存的存储方式(**实际结构**)如下图所示

<img src="https://s2.loli.net/2024/03/23/bxfe4ChXlFQudKB.png" alt="image-20240323124742679" style="zoom: 67%;" />

头指针(head)指向了地址150，150表示a1，a1的next域，也就是下一个地址值是110，110表示着a2的data域，也就是值域，后面都是以此类推

- 链表是以节点的方式来存储
- 每个节点包含data域；next域：指向下一个节点
- 如图：发现链表的各个节点不一定是连续存储
- 链表分带头节点的链表和没有头节点的链表，根据实际的需求来确定

单链表(带头节点)**逻辑结构**示意图如下

<img src="https://s2.loli.net/2024/03/23/YPd9SEjnLFvK2cX.png" alt="image-20240323130741493" style="zoom:50%;" />

### 单向链表

#### 创建示意图

![image-20240323131733288](https://s2.loli.net/2024/03/23/gE3zAT5nVdONJxt.png)

添加（创建）

1. 先创建一个head头节点，作用就是表示单链表的头
2. 后面我们每添加一个节点，就直接加入到链表的最后遍历

#### 创建和遍历

使用带head头的单向链表实现-水浒英雄排行榜管理

在添加英雄时，直接添加到链表的尾部

```java
package fun.eastwind.linkedList;

public class SingleLinkedListDemo {
    public static void main(String[] args) {
        // 创建测试节点
        HeroNode heroNode1 = new HeroNode(1, "宋江", "及时雨");
        HeroNode heroNode2 = new HeroNode(2, "卢俊义", "玉麒麟");
        HeroNode heroNode3 = new HeroNode(3, "吴用", "智多星");
        HeroNode heroNode4 = new HeroNode(4, "林冲", "豹子头");

        // 创建一个链表
        SingleLinkedList singleLinkedList = new SingleLinkedList();
        // 加入
        singleLinkedList.add(heroNode1);
        singleLinkedList.add(heroNode2);
        singleLinkedList.add(heroNode3);
        singleLinkedList.add(heroNode4);
        // 显示
        singleLinkedList.list();
    }
}

// 定义SingleLinkedList管理英雄人物
class SingleLinkedList {
    // 初始化头节点,头节点不动,不存放具体的数据
    private HeroNode head = new HeroNode(0,"","");

    // 添加节点到单向链表
    // 思路,当不考虑编号顺序时
    // 1.找到当前链表的最后节点
    // 2.将最后这个节点的next 指向新的节点
    public void add(HeroNode heroNode){

        // 因为head节点不能动,因此我们需要一个辅助遍历temp
        HeroNode temp = head;
        // 遍历链表,找到最后的链表值
        while (true){
            // 找到链表的最后
            if (temp.next == null){
                // temp的下一个值为空,说明链表已经走到最后了
                break;
            }
            // 如果没有找到最后,就向下一个节点移动
            temp = temp.next;
        }
        // 当退出while循环时,temp就指向了链表的最后一个值
        // 将最后这个节点的next 指向新的节点
        temp.next = heroNode;
    }

    // 显示链表[遍历]
    public void list(){
        if (head.next == null){
            // 判断头节点的next是否为空
            System.out.println("链表为空");
            return;
        }
        // 链表不为空,但头节点不能动,通过辅助变量进行遍历
        HeroNode temp = head.next;
        while (true){
            if (temp == null){
               break;
            }
            // 当临时变量不为空时,输出,并让临时变量变为下一个节点的值
            System.out.println(temp);
            temp = temp.next;
        }
    }
}

// 定义HeroNode,每个HeroNode对象就是一个节点
class HeroNode{
    public int no;  // 类似于id
    public String name; // 姓名
    public String nickName; // 昵称
    public HeroNode next;   // 指向下一个节点
    // 构造器
    public HeroNode(int hNo,String hName,String hNickName){
        this.no = hNo;
        this.name = hName;
        this.nickName = hNickName;
    }

    @Override
    public String toString() {
        return "HeroNode{" +
                "no=" + no +
                ", name='" + name + '\'' +
                ", nickName='" + nickName + '\'' +
                '}';
    }
}
```

#### 按顺序插入节点

使用带head头的单向链表实现-水浒英雄排行榜管理

根据排名将英雄插入到指定位置(如果有这个排名，则添加失败，并给出提示)

##### 思路分析

![image-20240323145603110](https://s2.loli.net/2024/03/23/9V1SYNdCLMkIJrW.png)

需要按照编号的顺序添加

1. 首先找到新添加的节点的位置，是通过辅助变量(指针)，通过遍历来搞定
2. 新的节点.next = temp.next
3. 将temp.next = 新的节点

##### 代码实现

```java
public class SingleLinkedListDemo {
    public static void main(String[] args) {
        // 创建测试节点
        HeroNode heroNode1 = new HeroNode(1, "宋江", "及时雨");
        HeroNode heroNode2 = new HeroNode(2, "卢俊义", "玉麒麟");
        HeroNode heroNode3 = new HeroNode(3, "吴用", "智多星");
        HeroNode heroNode4 = new HeroNode(4, "林冲", "豹子头");

        // 创建一个链表
        SingleLinkedList singleLinkedList = new SingleLinkedList();

        // 加入按照编号的顺序
        singleLinkedList.addByOrder(heroNode1);
        singleLinkedList.addByOrder(heroNode4);
        singleLinkedList.addByOrder(heroNode2);
        singleLinkedList.addByOrder(heroNode3);
        singleLinkedList.addByOrder(heroNode3);
        // 显示
        singleLinkedList.list();
    }
}
// 在添加英雄时，根据排名将英雄插入到指定位置
    // 如果有这个排名,则添加失败,并给出提示
    public void addByOrder(HeroNode heroNode) {
        // 因为头节点不能动,因此,通过辅助变量来帮助找到添加的位置
        HeroNode temp = head;
        boolean flag = false;    // flag标志添加的编号是否存在,默认为false
        while (true) {
            if (temp.next == null) {
                // 说明temp已经在链表的最后了
                break;
            }
            if (temp.next.no > heroNode.no) {
                // 例如:1,3,5 参数为1的next.no就是3,3 > 2刚好满足条件可以进行插入
                break;
            } else if (temp.next.no == heroNode.no) {
                // 说明希望添加的heroNode编号存在了
                flag = true;    // 说明编号存在
                break;
            }
            temp = temp.next;    // 后移,遍历当前链表
        }
        if (flag) {
            // 不能添加,说明编号存在
            System.out.printf("准备插入的英雄的%d编号已经存在\n", heroNode.no);
        } else {
            // 插入到链表中
            heroNode.next = temp.next;
            temp.next = heroNode;
        }
    }
```

#### 节点修改

根据no查询对应的节点，找到就进行修改，没找到就继续往下查找next的信息，直到next为null

```java
public class SingleLinkedListDemo {
    public static void main(String[] args) {
        // 创建测试节点
        HeroNode heroNode1 = new HeroNode(1, "宋江", "及时雨");
        HeroNode heroNode2 = new HeroNode(2, "卢俊义", "玉麒麟");
        HeroNode heroNode3 = new HeroNode(3, "吴用", "智多星");
        HeroNode heroNode4 = new HeroNode(4, "林冲", "豹子头");

        // 创建一个链表
        SingleLinkedList singleLinkedList = new SingleLinkedList();
        // 加入
//        singleLinkedList.add(heroNode1);
//        singleLinkedList.add(heroNode2);
//        singleLinkedList.add(heroNode3);
//        singleLinkedList.add(heroNode4);

        // 加入按照编号的顺序
        singleLinkedList.addByOrder(heroNode1);
        singleLinkedList.addByOrder(heroNode4);
        singleLinkedList.addByOrder(heroNode2);
        singleLinkedList.addByOrder(heroNode3);
        singleLinkedList.addByOrder(heroNode3);
        // 测试修改节点
        HeroNode newHeroNode = new HeroNode(2, "小卢", "玉麒麟~~");
        singleLinkedList.update(newHeroNode);
        // 显示
        singleLinkedList.list();
    }
}
// 修改节点的信息,根据no编号来修改,即no编号不能改
    public void update(HeroNode newHeroNode){
        // 根据新节点的编号修改
        if (head.next == null){
            System.out.println("链表为空");
            return;
        }
        // 找到需要修改的节点,根据no编号
        // 定义一个辅助变量
        HeroNode temp = head.next;
        boolean flag = false;   // 表示是否找到该节点
        while (true){
            if (temp == null){
                // 遍历完列表,依然为空
                break;
            }
            if (temp.no == newHeroNode.no){
                // 找到后将标记置为true
                flag = true;
                break;
            }
            temp = temp.next;
        }
        // 根据flag判断是否找到要修改的节点
        if (flag){
            temp.name = newHeroNode.name;
            temp.nickName = newHeroNode.nickName;
        }else{
            System.out.println("未找到该节点");
        }
    }
```

#### 删除

##### 思路分析

<img src="https://s2.loli.net/2024/03/23/pdWJAOtKyUmRx6F.png" alt="image-20240323155957133" style="zoom:67%;" />

1. 我们先找到需要删除的这个节点的前一个节点temp
2. temp.next = temp.next.next(相当于让被删除节点的上一个节点直接赋值了被删除节点的下一个节点)
3. 被删除的节点，将不会有其他引用指向，会被垃圾回收机制回收

##### 代码实现

```java
// 删除节点
    // 思路
    // head节点不能动,通过temp辅助节点找到待删除节点的前一个节点
    // 通过temp.next.no 与需要删除的节点的no比较
    public void delete(HeroNode newHeroNode){
        boolean flag;   // 是否找到删除的节点
        HeroNode temp = head;
        while (true){
            if (temp.next == null){
                // 说明链表为空
                System.out.println("链表为空");
                return;
            }
            if (temp.next.no == newHeroNode.no){
                // 判断相同
                // 相同说明找到了删除的节点
                flag = true;
                break;
            }
            temp = temp.next;
        }
        if (flag){
            // 删除节点
            // 假设节点为头节点,头节点的下一个节点如果不为空,就进行判断,如果相同,说明下一个节点是被删除的节点
            // 那么,我们就让head的下一个节点去指向head的下一个节点的下一个节点,假设为头节点,此时就从被删除的节点指向了null
            // 假设不是head,或后面依然存在节点,就跳过当前next
            temp.next = temp.next.next;
        }else{
            System.out.println("未找到该节点");
        }
    }
```

#### 面试题

1. 求单链表节点的个数

	```java
	 // 求单链表节点的个数
	    public void getSize(){
	        HeroNode temp = head.next;
	        int count = 0;
	        while (true){
	            if (temp == null){
	                break;
	            }
	            count ++;   // 统计数量++
	            temp = temp.next;   // 节点向下移动
	        }
	        System.out.println(count);
	    }
	```

2. 查找单链表中的倒数第k个节点【新浪面试题】

	```java
	// 查找单链表中的倒数第k个节点【新浪面试题】
	    // 思路
	    // 编写一个方法,接收head节点,同时接收一个index
	    // 先把链表从头到尾遍历,得到链表的总长度
	    // 得到size后,从链表的第一个开始遍历到(size-index)个,就可以得到结果
	    public HeroNode findLastIIndexNode(HeroNode head,int index){
	        // 判断如果链表为空,直接返回空
	        if (head.next == null) return null;
	        int size = getSize();
	        int resultNumber = size - index;
	        if (index <= 0  || resultNumber < 0){
	            return null;
	        }
	        HeroNode temp = head.next;
	        // 设有效数据为3个,而我想找到倒数第一个
	        // 那么 resultNumber = 3 - 1 = 2
	        // 将节点移动至位置1,再移动两次,即可来到位置3,位置3即为最后一个
	        for (int i = 0; i < resultNumber; i++) {
	            temp = temp.next;
	        }
	        return temp;
	    }
	```

3. 单链表的反转【腾讯面试题】

  <img src="https://s2.loli.net/2024/03/23/d86VzsOqjBGlNpE.png" alt="image-20240323224820928" style="zoom:50%;" />

  reverseHead节点是为了存储反转数据，流程如下：

  先使用临时变量备份除了反转节点以外的数据，比如说，我们要翻转当前节点，那么就要从当前节点的下一个节点开始备份，让当前节点赋值反转链表的参数值，这个参数值是已经被反转过的值，如果是第一次，反转链表的值是空，就让当前节点的.next赋值为null，然后将当前节点的值赋值到反转链表中，并后移，从第二次开始，第二次就会备份从二节点以后备份，让当前链表的值的next去指向反转数组之前的一节点，然后将当前链表值赋予反转数组，以此类推，后面的3节点直接赋值反转链表的数据，也就是2、1节点，并赋值反转链表，如果还有4节点，就让4节点指向3、2、1节点，4节点的当前链表直接赋予反转链表，最后链表去指向反转链表的next就得到了反转链表的值

  ```java
  // 单链表的反转
      public void reverseHead(){
          // 如果当前链表为空或只有一个节点,无需反转,直接返回
          if (head.next == null || head.next.next == null) return;
          // 定义一个辅助的指针(变量),帮助我们遍历原来的链表
          HeroNode cur = head.next;
          HeroNode next = null;       // 指向当前节点[cur]的下一个节点
          HeroNode reverseHead = new HeroNode(0,"","");
          // 遍历原来的链表,每遍历一个节点,就将其取出,放在新的链表reverseHead的最前端
          // 例如:1、2、3,
          // 第一次进入时next为2,并让当前节点的下一个节点(2)获得了反转链表的头节点的地址
          // 然后令头节点的地址指向1,并让当前地址变为下一个节点
          // 第二次进入时next为3,并让当前节点的下一个节点(3)获得了反转链表的头节点的地址(2)
          // 然后令当前头节点的地址为2,并继续后移,此时为空,进行head.next的操作,让原先的头节点去指向反转链表的头节点的值
          while (cur != null){
              // 当链表没有走到最后时
              next = cur.next;        // 暂时保存当前节点的下一个节点所有值(做了一个参数备份)
              cur.next = reverseHead.next;    // 将当前节点赋值了之前反转链表传入的值
              reverseHead.next = cur;     // 不断获取新的头链表
              cur = next;     // 让cur后移
          }
          // 将head.next 指向reverseHead.next,实现单链表的反转
          head.next = reverseHead.next;
      }
  ```

4. 从尾到头打印单链表【百度，要求方式1：反向遍历。方式2：Stack栈】

	通过栈数据结构，将各个节点压入到栈中，然后利用栈先进后出的特性，实现逆序打印的效果

	这里简单说明一下栈的使用

	入栈是一个一个的存入，最先存入的栈会在最底下，最后存入的在最上面，取出的时候从上面往下取

	<img src="https://s2.loli.net/2024/03/24/34kp7ocvLxgiz1m.png" alt="image-20240324104340796" style="zoom: 33%;" />

	```java
	import java.util.Stack;
	
	// 演示栈Stack的基本使用
	public class TestStack {
	    public static void main(String[] args) {
	        Stack<String> stack = new Stack<>();
	        // 入栈
	        stack.add("jack");
	        stack.add("tom");
	        stack.add("smith");
	
	        // 出栈
	        while (stack.size() > 0){
	            // pop是将栈顶的数据取出
	            System.out.println(stack.pop());
	        }
	    }
	}
	```

	Stack(栈)逆序打印

	```java
	 // 从尾到头打印单链表
	    public void reversePrintTable(){
	        // 从头到尾将单链表存入栈,然后取出即可
	        if (head.next == null){
	            // 判断头节点的下一个节点是否为空,为空直接返回
	            return;
	        }
	        HeroNode temp = head.next;
	        Stack<HeroNode> nodeStack = new Stack<>();
	        while (temp != null){
	            nodeStack.add(temp);
	            temp = temp.next;
	        }
	        while (nodeStack.size() > 0) {
	            System.out.println(nodeStack.pop());
	        }
	    }
	```

5. 合并两个有序的单链表，合并之后的链表依然有序【练习】

```java
 // 合并两个有序的单链表，合并之后的链表依然有序
    public HeroNode mergeHeroNode(HeroNode node1,HeroNode node2){
        // 判断两个单链表是否都为空,为空直接返回空
        if (node1.next == null && node2.next == null){
            return null;
        }
        // 合并的链表存在一个新链表中
        HeroNode heroNode3 = new HeroNode(0, "", "");
        if (node1.next == null){
            // 判断其中一个链表是否为空,如果为空,直接拼接另一个链表
            heroNode3.next = node2;
        } else if (node2.next == null) {
            heroNode3.next = node1;
        }else{
            // 两个有序链表,以及一个空链表
            // 让node3去指向node1
            heroNode3.next = node1.next;
            // 定义辅助指针,遍历node2
            HeroNode cur2 = node2.next;
            // 定义辅助指针,遍历node3
            HeroNode cur3 = heroNode3;
            // 存储指针数据,用于恢复
            HeroNode next = null;
            // 当cur2链表没被遍历完时
            // 对cur2链表进行遍历
            while (cur2 != null){
                if (cur3.next == null){
                    // 防止出现cur3的值已经遍历完了,但cur2的值还没遍历完的情况
                    // 因为两个链表都是有序的,所以,当cur3的值统一的排序后,cur2的值都是大于cur3的值的
                    // 直接插入即可
                    cur3.next = cur2;
                    break;
                }
                if (cur2.no <= cur3.next.no){
                    // 当cur2的节点编号小于cur3的节点编号时,就进入
                    // 例如cur2:1 3 5,cur3:2 4 6
                    // 进入后保存cur2的下面的其他节点值,变为3 5
                    // 并让cur2的下一个节点指向大于等于它的cur3的下一个节点值,很明显1会去指向2 4 6的节点值
                    // 指向后,让cur3的节点值再将cur2的节点值赋值回来,并恢复cur2的原结果值
                    // 此时cur2 = 3 5;cur3 = 1 2 4 6,相当于是排序后拼接了
                    // 说明要插入的节点的排序值满足了排序条件,将下一个节点保存
                    next = cur2.next;   // 保存下一个节点值
                    cur2.next = cur3.next;  // 让cur2的下一个节点去指向cur3的下一个节点
                    cur3.next = cur2;   // 让cur2连接到cur3上
                    cur2 = next;    // 后移
                }
                cur3 = cur3.next;
            }

        }
        return heroNode3;
    }
```

### 双向链表

#### 思路分析

![image-20240324151243406](https://s2.loli.net/2024/03/24/sTpjWwJdOfUkzq9.png)

分析双向链表的遍历，添加，修改，删除的操作思路-->

1. 遍历和单链表是一致是，但是双向链表可以从后往前查找
2. 添加（默认添加到双向链表的最后）
	1. 先找到双向链表的最后一个节点
	2. temp.next = newNode（最后一个节点的下一个节点去指向最新的节点）
	3. newNode.pre = temp（新节点的前一个节点去指向之前的最后一个节点）
3. 修改思路和单向链表是一致的
4. 删除
	1. 因为是双向链表，因此，可以实现自我删除某个节点
	2. 直接找到要删除的这个节点，比如temp
	3. temp.pre.next = temp.next（令当前节点的上一个节点去指向为当前节点的下一个节点）
	4. temp.next.pre = temp.pre（令当前节点的下一个节点去指向当前节点的下一个节点）
	5. 当删除最后一个节点时，就不需要令当前被删除节点的下一个节点去指向当前被删除节点的下一个节点了，因为为空是不需要进行上一个节点的指向的

#### 代码实现

```java
package fun.eastwind.linkedList;

public class TwoLinkedListDemo {
    public static void main(String[] args) {
        TwoLinkedList twoLinkedList = new TwoLinkedList();
        TwoNode heroNode1 = new TwoNode(1, "宋江", "及时雨");
        TwoNode heroNode2 = new TwoNode(8, "卢俊义", "玉麒麟");
        TwoNode heroNode3 = new TwoNode(3, "吴用", "智多星");
        TwoNode heroNode4 = new TwoNode(7, "林冲", "豹子头");
        twoLinkedList.add(heroNode1);
        twoLinkedList.add(heroNode2);
        twoLinkedList.add(heroNode3);
        twoLinkedList.add(heroNode4);
//        twoLinkedList.list();
//        twoLinkedList.reversedList();
        heroNode4.nickName = "张三";
        heroNode4.name = "zhangsan";
        twoLinkedList.update(heroNode4);
        twoLinkedList.del(1);
        twoLinkedList.del(7);
        twoLinkedList.del(3);
        twoLinkedList.del(8);
        twoLinkedList.list();
    }
}

class TwoLinkedList{
    private TwoNode head = new TwoNode(0, "", "");

    // 删除双向链表
    public void del(int hNo){
        // 查看双向链表的no值
        TwoNode temp = head.next;
        while (temp != null){
            if (temp.no == hNo){
                // 找到要删除的值
                temp.pre.next = temp.next;
                if (temp.next != null){
                    // 最后一个节点为空
                    temp.next.pre = temp.pre;
                }
                break;
            }
            temp = temp.next;
        }
    }

    // 修改双向链表
    public void update(TwoNode twoNode){
        TwoNode temp = head.next;
        while (temp != null){
            // 遍历no是否一致
            if (temp.no == twoNode.no){
                temp.name = twoNode.name;
                temp.nickName = twoNode.nickName;
                break;
            }
            temp = temp.next;
        }
    }

    // 反向遍历双向链表
    public void reversedList(){
        TwoNode temp =  head;
        while (temp.next != null){
            // 遍历到temp的结尾
            // 当temp的next为空时,就为next添加一个节点到最尾部
            temp = temp.next;
        }
        while (temp != null){
            // 遍历到temp的结尾
            // 当temp的next为空时,就为next添加一个节点到最尾部
            System.out.println(temp);
            temp = temp.pre;
        }
    }

    // 输出双向链表
    public void list(){
        TwoNode temp =  head;
        while (temp != null){
            // 遍历到temp的结尾
            System.out.println(temp);
            temp = temp.next;
        }
    }

    // 对双向链表增加新节点(添加到尾部)
    public void add(TwoNode newNode){
        TwoNode temp =  head;
        while (temp.next != null){
            // 遍历到temp的结尾
            // 当temp的next为空时,就为next添加一个节点到最尾部
            temp = temp.next;
        }
        temp.next = newNode;
        newNode.pre = temp;
    }

}

// 定义HeroNode,每个HeroNode对象就是一个节点
class TwoNode {
    public int no;  // 类似于id
    public String name; // 姓名
    public String nickName; // 昵称
    public TwoNode next;   // 指向下一个节点
    public TwoNode pre;   // 指向上一个节点

    // 构造器
    public TwoNode(int hNo, String hName, String hNickName) {
        this.no = hNo;
        this.name = hName;
        this.nickName = hNickName;
    }

    @Override
    public String toString() {
        return "HeroNode{" +
                "no=" + no +
                ", name='" + name + '\'' +
                ", nickName='" + nickName + '\'' +
                '}';
    }
}
```

### 环形链表

环形链表涉及到了一个约瑟夫问题

约瑟夫问题（Josephu问题）：设编号1,2,....n的n个人围坐一圈，约定编号k(1<=k<=n)的人开始报数，数到m的那个人出列，它的下一位又从1开始报数，数到m的那个人又出列，以此类推，直到所有人出列为止，由此产生一个出队编号的序列。

#### 思路分析

<img src="https://s2.loli.net/2024/03/25/OuzaD1N65ELtjgl.png" alt="image-20240325082548571" style="zoom:50%;" />

假设n = 5;k=1;m=2;

从1开始往后数m下,那么就是1,2；将2提出队列，再到3时，就是3、4；将4提出队列；依次往下，直到3本身，它自己也是一个环形队列，然后它本身自己出列即可

构建一个单向的环形链表的思路:

1. 先创建第一个节点，让first指向该节点，并形成环形
2. 后面当我们每创建一个新的节点，就把该节点，加入到已有的环形链表中即可

创建第一个节点，它的next指向first节点，并让first节点去指向第一个节点，形成第一个环形，而后面每创建一个节点，就调整后面的节点数量-1的next，例如创建第二个节点，就让第一个节点的next去指向第二个节点，并让第二个节点的next去指向first，以此类推

#### 代码实现

遍历环形链表

1. 先让一个辅助指针（变量）curBoy，指向first节点
2. 然后通过一个while循环遍历该环形链表即可，curBoy.next == first 结束

```java
package fun.eastwind.linkedList;

public class CircleSingleLinkedListDemo {
    public static void main(String[] args) {
        CircleSingleLinkedList circleSingleLinkedList = new CircleSingleLinkedList();
        circleSingleLinkedList.add(3);
        circleSingleLinkedList.list();
    }
}

// 创建环形单向链表
class CircleSingleLinkedList{
    // 创建first节点,没有编号;
    private Boy first = new Boy(-1);
    // 添加小孩节点,构建成环形链表
    public void add(int number){
        // number表示需要创建几个节点
        if (number < 1){
            // 对number做数据校验
            System.out.println("number的值不正确");
            return;
        }
        Boy curBoy = null;  // 辅助指针,帮助构建环形链表
        for (int i = 1; i <= number; i++) {
            // 根据编号,创建节点
            Boy boy = new Boy(i);
            if (i == 1){
                first =  boy;
                // 让首节点指向自己
                first.setNext(first);   // 构成环
                curBoy = first; // 这里相当于一个临时变量,为后面的节点做铺垫
            }
            else{
                // 节点不为第一个节点时
                curBoy.setNext(boy);    // 修改下一个节点为新建的节点
                boy.setNext(first); // 设置这个节点(最后一个节点的下一个节点关联首节点)
                curBoy = boy;   // 并让当前节点向下移动,为下一次节点构建做准备
            }
        }
    }

    // 遍历双向链表
    public void list(){
        if (first == null){
            System.out.println("链表为空");
            return;
        }
        Boy temp = first;
        while (true){
            System.out.println(temp.getNo());
            if (temp.getNext() == first){
                // 当临时节点的下一个节点为first时,说明节点遍历结束
                break;
            }
            temp = temp.getNext();
        }
    }
}

class Boy{
    private int no; // 编号
    private Boy next;   // 指向下一个节点,默认为null

    public Boy(int no) {
        this.no = no;
    }

    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public Boy getNext() {
        return next;
    }

    public void setNext(Boy next) {
        this.next = next;
    }
}
```

#### 约瑟夫问题

约瑟夫问题（Josephu问题）：设编号1,2,....n的n个人围坐一圈，约定编号k(1<=k<=n)的人**开始报数**，数到m的那个人出列，它的下一位又从1开始报数，数到m的那个人又出列，以此类推，直到所有人出列为止，由此产生一个出队编号的序列。

tip：用一个不带头节点的循环链表来处理Josephu问题：先构成一个有n个结点的单循环链表，然后由k结点起从1开始计数，计到m时，对应结点从链表中删除，然后再从被删除结点的下一个结点又从1开始计数，直到最后一个结点从链表中删除，算法结束。

思路：

1. 需要创建一个辅助指针（变量）helper，事先应该指向环形链表的最后这个节点

2. 在报数前，需要先移动到k-1次这个位置，因为是从k开始报数，假设k = 1，那么移动0个位置即可

3. 当小孩报数时，让first和helper指针同时的移动m - 1次

4. 这时就可以将first指向的小孩节点出圈

	first = first.next

	helper.next = first

	原来的first指向的节点就没有任何引用，就会被回收

```java
package fun.eastwind.linkedList;

public class CircleSingleLinkedListDemo {
    public static void main(String[] args) {
        CircleSingleLinkedList circleSingleLinkedList = new CircleSingleLinkedList();
        circleSingleLinkedList.add(5);
        circleSingleLinkedList.countBoy(1,2,5);
    }
}
// 创建环形单向链表
class CircleSingleLinkedList{
    // 创建first节点,没有编号;
    private Boy first = new Boy(-1);

    // 根据用户的输入,计算出出圈的编号列表
    /**
     * startNo:表示从第几个小孩开始计算
     * countNum:表示数几次
     * nums:表示最初有多少小孩在圈中
     * */
    public void countBoy(int startNo,int countNum,int nums){
        // 对数据校验
        if (first == null || startNo < 1 || startNo > nums ){
            // 队列为空或从小于1开始计算或开始值大于总值,都不可计算
            // 例如:不能从第0个小孩开始计算,或者说,总数有3个,从第4个开始计算,都是不合理的
            System.out.println("参数输入有误");
            return;
        }
        // 创建辅助指针
        Boy helper = first;
        // 辅助指针会事先指向环形链表的最后一个节点
        while (true){
            if (helper.getNext() == first){
                // 其下一个节点是first,说明来到了最后一个节点
                break;
            }
            helper = helper.getNext();
        }
        // 报数前,需要先移动到报数的位置，也就是startNo处,假设我们要移动到第一个小孩处,那么就从first移动startNo - 1次
        for (int j = 0; j < startNo - 1; j++) {
            first = first.getNext();
            helper = helper.getNext();
        }
        // 进行出圈操作
        while (true){
            if (helper == first){
                // 说明圈中只有一个节点
                break;
            }
            // 让first和helper指针同时移动需要移动的个数 - 1,因为计数结果是包含自身的
            for (int j = 0; j < countNum - 1; j++) {
                first = first.getNext();
                helper = helper.getNext();
            }
            System.out.printf("小孩出圈%d\n",first.getNo());
            // 让小孩节点出圈
            first = first.getNext();
            // 让辅助节点的下一个节点置为出圈节点的下一个节点
            helper.setNext(first);
        }
        System.out.println("最后一个节点" + first.getNo());
    }

    // 添加小孩节点,构建成环形链表
    public void add(int number){
        // number表示需要创建几个节点
        if (number < 1){
            // 对number做数据校验
            System.out.println("number的值不正确");
            return;
        }
        Boy curBoy = null;  // 辅助指针,帮助构建环形链表
        for (int i = 1; i <= number; i++) {
            // 根据编号,创建节点
            Boy boy = new Boy(i);
            if (i == 1){
                first =  boy;
                // 让首节点指向自己
                first.setNext(first);   // 构成环
                curBoy = first; // 这里相当于一个临时变量,为后面的节点做铺垫
            }
            else{
                // 节点不为第一个节点时
                curBoy.setNext(boy);    // 修改下一个节点为新建的节点
                boy.setNext(first); // 设置这个节点(最后一个节点的下一个节点关联首节点)
                curBoy = boy;   // 并让当前节点向下移动,为下一次节点构建做准备
            }
        }
    }

    // 遍历双向链表
    public void list(){
        if (first == null){
            System.out.println("链表为空");
            return;
        }
        Boy temp = first;
        while (true){
            System.out.println(temp.getNo());
            if (temp.getNext() == first){
                // 当临时节点的下一个节点为first时,说明节点遍历结束
                break;
            }
            temp = temp.getNext();
        }
    }
}

class Boy{
    private int no; // 编号
    private Boy next;   // 指向下一个节点,默认为null

    public Boy(int no) {
        this.no = no;
    }

    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public Boy getNext() {
        return next;
    }

    public void setNext(Boy next) {
        this.next = next;
    }
}
```

## 栈

### 基本介绍

1. 栈的英文是(Stack)
2. 栈是一个先进后出(FILO-First In Last Out)的有序列表
3. 栈(stack)是限制线性表中元素的插入和删除只能在线性表的同一端进行的一种特殊线性表。允许插入和删除的一端，为变化的一端，称为栈顶(Top)，另一端为固定的一端，称为栈底(Bottom)。
4. 根据栈的定义可知，最先放入栈中的元素在栈底，最后放入的元素在栈顶，而删除元素刚好相反，最后放入的元素最先删除，最先放入的元素最后删除

### 应用场景

1. 子程序的调用：在跳往子程序前，会先将下个指令的地址存到堆栈中，直到子程序执行完后再将地址取出，回到原来的程序中
2. 处理递归调用：和子程序的调用类似，只是除了储存下一个指令的地址外，也将参数、区域变量等数据存入堆栈中
3. 表达式的转换与求值
4. 二叉树的遍历
5. 图形的深度优先(depth -- first)搜索法

### 思路分析(数组模拟栈)

1. 使用数组来模拟栈
2. 定义一个top来表示栈顶，初始化为-1
3. 入栈的操作，当有数据加入到栈时，top++;stack[top] = data;
4. 出栈的操作， int value = stack[top];top--,return value

### 代码实现

```java
package fun.eastwind.stack;

import java.util.Scanner;

public class ArrayStackDemo {
    public static void main(String[] args) {
        // 测试ArrayStack
        ArrayStack arrayStack = new ArrayStack(4);
        String key = "";
        boolean loop = true;    // 控制是否退出菜单
        Scanner scanner = new Scanner(System.in);

        while (loop){
            System.out.println("s:显示栈");
            System.out.println("e:退出程序");
            System.out.println("push:入栈");
            System.out.println("pop:出栈");
            System.out.println("please input your choice");
            key = scanner.next();
            switch (key){
                case "s":
                    arrayStack.list();
                    break;
                case "e":
                    scanner.close();
                    loop = false;
                    break;
                case "push":
                    System.out.println("please input your number");
                    int num = scanner.nextInt();
                    arrayStack.push(num);
                    break;
                case "pop":
                    try{
                        int pop = arrayStack.pop();
                        System.out.println("出栈的数据为" + pop);
                    }
                    catch (Exception e){
                        System.out.println(e.getMessage());
                    }
                    break;
            }
        }
    }
}

// 定义一个ArrayStack表示栈
class ArrayStack{
    private int maxSize;    // 栈的大小
    private int[] stack;    // 模拟栈的数组
    private int top = -1;  // 栈顶,初始化为-1,表示无数据

    // 栈满
    public boolean isFull(){
        // 当栈顶为最大值-1时,说明此时已经来到了顶峰
        return top == maxSize - 1;
    }

    // 栈空
    public boolean isEmpty(){
        // 当栈为-1时,说明栈空
        return top == -1;
    }

    // 入栈
    public void push(int num){
        // 判断栈是否已满,满就不加入
        if (isFull()){
            System.out.println("栈已满");
            return;
        }
        // 入职需要将栈顶+1
        top++;
        stack[top] = num;
    }

    // 出栈
    public int pop(){
        // 判断栈是否为空,为空则不出栈
        if (isEmpty()){
            // 抛出异常
            throw new RuntimeException("栈空");
        }
        int val = stack[top];
        top--;
        return val;
    }

    // 遍历栈
    public void list(){
        // 判断栈是否为空,为空则不出栈
        if (isEmpty()){
            System.out.println("栈为空");
            return;
        }
        for (int i = top; i >= 0; i--) {
            System.out.println(stack[i]);
        }
    }

    public ArrayStack(int maxSize) {
        this.maxSize = maxSize;
        this.stack = new int[maxSize];  // 初始化栈
    }
}
```

### 链表模拟栈

```java
package fun.eastwind.stack;

import java.util.Scanner;
import java.util.Stack;

/**
 * 通过链表模拟栈
 */
public class LinkedForStackDemo {
    public static void main(String[] args) {
        LinkedStackList linkedStackList = new LinkedStackList(4);
        String key = "";
        boolean loop = true;    // 控制是否退出菜单
        Scanner scanner = new Scanner(System.in);

        while (loop){
            System.out.println("s:显示栈");
            System.out.println("e:退出程序");
            System.out.println("push:入栈");
            System.out.println("pop:出栈");
            System.out.println("please input your choice");
            key = scanner.next();
            switch (key){
                case "s":
                    linkedStackList.list();
                    break;
                case "e":
                    scanner.close();
                    loop = false;
                    break;
                case "push":
                    System.out.println("please input your number");
                    int num = scanner.nextInt();
                    linkedStackList.push(num);
                    break;
                case "pop":
                    try{
                        int pop = linkedStackList.pop();
                        System.out.println("出栈的数据为" + pop);
                    }
                    catch (Exception e){
                        System.out.println(e.getMessage());
                    }
                    break;
            }
        }
    }
}

/*
 * 链表模拟栈
 * */
class LinkedStackList {
    int maxSize;

    public LinkedStackList(int maxSize) {
        this.maxSize = maxSize;
    }

    LinkedStack head = new LinkedStack(-1);

    // 遍历栈(反向遍历链表)
    public void list(){
        if (isEmpty()){
            System.out.println("栈空");
            return;
        }
        LinkedStack temp = head.next;
        Stack<LinkedStack> linkedStacks = new Stack<>();
        while (temp != null){
            // 出栈时,首先查看当前栈是否为空,不为空说明至少有一个数据
            // 从第二个开始判断,并记录第一个的值
            linkedStacks.add(temp);
            temp = temp.next;
        }
        int size = linkedStacks.size();
        for (int i = 0; i < size; i++) {
            System.out.println(linkedStacks.pop().val);
        }
    }

    // 出栈
    public int pop() {
        if (isEmpty()) {
            throw new RuntimeException("栈空");
        }
        LinkedStack temp = head;
        // 1 2 3
        // val -> 2
        // temp -> 2
        while (temp.next.next != null){
            // 出栈时,首先查看当前栈是否为空,不为空说明至少有一个数据
            // 从第二个开始判断,并记录第一个的值
            temp = temp.next;
        }
        int Values = temp.next.val;
        temp.next = null;
        return Values;
    }

    // 入栈
    public void push(int val) {
        if (isFull()){
            System.out.println("栈满");
            return;
        }
        LinkedStack temp = head;
        while (temp.next != null) {
            temp = temp.next;
        }
        temp.next = new LinkedStack(val);
    }

    // 查询当前栈是否为空
    public boolean isEmpty() {
        return head.next == null;
    }

    // 查询当前栈是否已满
    public boolean isFull() {
        int count = 0;
        LinkedStack temp = head.next;
        while (temp != null) {
            count++;
            temp = temp.next;
        }
        return count == maxSize;
    }
}

/*
 * 链表
 * */
class LinkedStack {
    int val;    // this is value,for use
    LinkedStack next;    // 链表的下一个节点

    public LinkedStack(int val) {
        this.val = val;
    }
}
```

### 栈实现综合计算器

#### 思路分析

<img src="https://s2.loli.net/2024/03/28/Z7OiCYKAH6qSJN9.png" alt="image-20240328124522375" style="zoom:50%;" />

使用栈完成表达式的计算思路

1. 通过一个index值(索引)，来遍历我们的表达式
2. 如果我们发现是一个数字，就直接入数栈
3. 如果扫描到发现是一个符号，就分如下情况
	1. 如果符号栈为空，直接入栈
	2. 如果发现符号栈有操作符，就进行比较，如果当前的操作符优先级小于或等于栈中的操作符，就需要从数栈中pop出两个数，在符号栈中pop出一个符号，进行运算，将得到的结果，入数栈，然后将当前操作符入符号栈，如果当前操作符的优先级大于栈中的操作符，则直接入栈
	3. 当表达式扫描完毕，就顺序的从数栈和符号栈中pop出相应的数和符号，并运行
	4. 最后在数栈中只有一个数字，就是表达式的结果

#### 代码实现

有缺陷，未实现数字连续减法功能

```java
package fun.eastwind.stack;

public class Calculator {
    public static void main(String[] args) {
        String expression = "300+2-6-2";
        // 创建两个栈,一个是数栈,一个是符号栈
        ArrayStack2 numberStack = new ArrayStack2(10);
        ArrayStack2 operationStack = new ArrayStack2(10);
        // 定义需要的相关变量
        int index = 0 ;
        while (true){
            String keepNum = "";    // 用于拼接多位数
            char val = expression.charAt(index);
            if (operationStack.isOper(val)){
                // 如果是符号栈,当符号栈为空,存入栈中,否则判断优先级,如果当前优先级大于符号栈中的优先级
                // 直接存入,否则,当栈中的优先级小于或等于当前栈时,取出栈中值,并取出对应数值,进行计算
                if(operationStack.isEmpty()){
                    operationStack.push(val);
                }else{
                    // 栈不为空,比较优先级
                    int priority = operationStack.priority(val);
                    int stackVal = operationStack.priority(operationStack.peek());
                    if (priority >= stackVal){
                        // 大于等于栈中的值
                        // 存入
                        operationStack.push(val);
                    }else{
                        // 取出数栈中值,并取出符号栈中值进行计算,计算后
                        // 结果集存入数字栈,再将刚刚的符号存入符号栈
                        int pop = operationStack.pop();
                        int val2 = numberStack.pop();
                        int val1 = numberStack.pop();
                        int cal = numberStack.cal(val1, val2, pop);
                        numberStack.push(cal);
                        operationStack.push(val);
                    }
                }
            }else{
                // 判断下一个字符是否为数字,如果是运算符,则入栈
                keepNum += val;
                while (index + 1 < expression.length() && !operationStack.isOper(expression.charAt(index+1))){
                    index++;
                    keepNum += expression.charAt(index);
                }
                numberStack.push(Integer.parseInt(keepNum));
                // 不为符号则为数字
//                numberStack.push(val - 48);     // '1' - 48 => 1
                // 1.当处理多位数,不能发现是一个数字就立即入栈,因为其有可能是多位数
                // 2.在处理数时,需要向expression的表达式的index后再看一位,如果是数就进行扫描,如果是符号才入栈
                // 3.因此我们需要定义一个变量 字符串,用于拼接
            }
            index ++;
            if (expression.length() == index){
                break;
            }
        }
        // 表达式扫描完毕,顺序的取出对应的数字和符号
        while (true){
            // 如果符号栈为空,就取出结果
            int num2 = numberStack.pop();
            int num1 = numberStack.pop();
            int operation = operationStack.pop();
            int cal = numberStack.cal(num1, num2, operation);
            numberStack.push(cal);
            if(operationStack.isEmpty())break;
        }
        System.out.println(numberStack.pop());
    }
}

// 定义一个ArrayStack表示栈
class ArrayStack2{
    private int maxSize;    // 栈的大小
    private int[] stack;    // 模拟栈的数组
    private int top = -1;  // 栈顶,初始化为-1,表示无数据

    // 查看栈顶的变量值,但不删除
    public int peek(){
        return stack[top];
    }

    // 返回运算符的优先级,自定,返回的数字越大优先级越高
    public int priority(int operation){
        if (operation == '*' || operation == '/'){
            return 1;
        } else if (operation == '+' || operation == '-') {
            return 0;
        }else{
            return  -1;     // 假定的表达式只有加减乘除
        }
    }

    // 判断是否为运算符
    public boolean isOper(char val){
        // 如果val为+、-、*、/
        return val == '+' || val == '-' || val == '*' || val == '/';
    }
    // 计算方法
    public int cal(int num1,int num2,int operation){
        int res = 0;
        switch (operation){
            case '+':res = num1 + num2;break;
            case '-':res = num1 - num2;break;
            case '*':res = num1 * num2;break;
            case '/':res = num1 / num2;break;
        }
        return res;
    }

    // 栈满
    public boolean isFull(){
        // 当栈顶为最大值-1时,说明此时已经来到了顶峰
        return top == maxSize - 1;
    }

    // 栈空
    public boolean isEmpty(){
        // 当栈为-1时,说明栈空
        return top == -1;
    }

    // 入栈
    public void push(int num){
        // 判断栈是否已满,满就不加入
        if (isFull()){
            System.out.println("栈已满");
            return;
        }
        // 入职需要将栈顶+1
        top++;
        stack[top] = num;
    }

    // 出栈
    public int pop(){
        // 判断栈是否为空,为空则不出栈
        if (isEmpty()){
            // 抛出异常
            throw new RuntimeException("栈空");
        }
        int val = stack[top];
        top--;
        return val;
    }

    // 遍历栈
    public void list(){
        // 判断栈是否为空,为空则不出栈
        if (isEmpty()){
            System.out.println("栈为空");
            return;
        }
        for (int i = top; i >= 0; i--) {
            System.out.println(stack[i]);
        }
    }

    public ArrayStack2(int maxSize) {
        this.maxSize = maxSize;
        this.stack = new int[maxSize];  // 初始化栈
    }
}
```

### 前缀、中缀、后缀表达式规则

**前缀表达式（波兰表达式）**

1. 前缀表达式又称波兰式，前缀表达式的运算符位于操作数之前
2. 举例说明：(3 + 4) × 5 - 6对应的前缀表达式就是- × + 3 4 5 6

前缀表达式求值

从右至左扫描表达式，遇到数字时，将数字压入堆栈，遇到运算符时，弹出栈顶的两个数，用运算符对它们做相应的计算（栈顶元素和次顶元素），将结果入栈；重复上述过程，直到表达式最左端，最后运算得出的值即为表达式的结果

例如：(3 + 4) × 5 - 6对应的前缀表达式就是- × + 3 4 5 6，针对前缀表达式求值步骤如下：

1. 从右至左扫描，将6、5、4、3压入堆栈
2. 遇到+运算符因此弹出3和4（3为栈顶元素，4为次顶元素），计算3+4的值，得7，并入栈
3. 接着是×运算符，因此弹出7和5，计算7×5 = 35，将35入栈
4. 最后是-运算符，计算35-6的值，即29，由此得出结果

**中缀表达式**

1. 中缀表达式就是常见的运算表达式，如（3+4）×5-6
2. 中缀表达式的求值是我们最熟悉的，但对计算机来说不好操作，因此，在计算时，通常会将中缀表达式转成其他表达式来操作

后缀表达式

1. 后缀表达式又称逆波兰表达式，与前缀表达式相似，只是运算符位于操作数之后
2. 举例说明：(3 + 4) × 5 - 6对应的后缀表达式就是3 4 + 5 × 6 -

| 正常的表达式    | 逆波兰表达式  |
| --------------- | ------------- |
| a + b           | a b +         |
| a + (b - c)     | a b c - +     |
| a + (b - c) * d | a b c - d * + |
| a + d * (b - c) | a d b c - * + |
| a = 1 + 3       | a 1 3 + =     |

后缀表达式的计算机求值

从左至右扫描表达式，遇到数字时，将数字压入堆栈，遇到运算符时，弹出栈顶两个数，用运算符对它们做相应的计算（次顶元素和栈顶元素），并将结果入栈；重复上述操作，直到表达式的最右端，最后运算得出的值即为表达式的结果

例如：(3 + 4) × 5 - 6对应的后缀表达式就是3 4 + 5 × 6 -，针对后缀表达式求值步骤如下：

1. 从左至右扫描，将3和4压入堆栈
2. 遇到+运算符，因此弹出4和3（4为栈顶元素，3为次顶元素），计算3 + 4的值，得7，再将7入栈
3. 将5入栈
4. 接下来是×运算符，因此弹出5和7，计算7×5=35，将35入栈
5. 将6入栈
6. 最后是-运算符，计算35-6的值，即29，由此得出最后结果

### 逆波兰计算器

1. 输入一个逆波兰表达式，使用栈(Stack)，计算其结果
2. 支持小括号和多位数整数

#### 代码实现

```java
package fun.eastwind.stack;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class PolandNotation {
    public static void main(String[] args) {
        // 先定义一个逆波兰表达式
        // 原式为:(3 + 4) * 5 - 6;
        String suffixExpression = "30 4 + 5 * 6 - ";
        // 思路,将这段字符串放到ArrayList中
        // 将ArrayList传递给一个方法，遍历ArrayList配合栈完成计算
        List<String> listString = getListString(suffixExpression);
        System.out.println(calculate(listString));
    }

    // 对逆波兰表达式的运算
    public static int calculate(List<String> ls){
        // 创建一个栈
        Stack<String> stack = new Stack<>();
        // 遍历ls
        for (String l : ls) {
            // 使用正则表达式匹配数字
            if (l.matches("\\d+")){
                // \d表示匹配单个数字,\d+表示匹配多个数字,这里的\\是为了转义
                // 满足数字就运算
                stack.push(l);
            }else{
                // 不是数字,则是运算符
                // pop出两个数,并运算,结果再次入栈
                // 弹出的数字2,因为栈是先进后出,所以是让num1-num2,而num2在num1的后面,所以先出的是num2
                int num2 = Integer.parseInt(stack.pop());
                int num1 = Integer.parseInt(stack.pop());
                int res = 0;    // 结果
                if (l.equals("+")){
                    res = num1 + num2;
                } else if (l.equals("-")) {
                    res = num1 - num2;
                } else if (l.equals("*")) {
                    res = num1 * num2;
                } else if (l.equals("/")) {
                    res = num1 / num2;
                }else{
                    throw new RuntimeException("运算符有问题");
                }
                stack.push(res + "");
            }
        }
        return Integer.parseInt(stack.pop());
    }

    // 将一个逆波兰表达式,依次将数据和运算符放入到ArrayList中
    public static List<String> getListString(String suffixExpression){
        // 将suffixExpression 分割
        String[] split = suffixExpression.split(" ");
        List<String> list = new ArrayList<>();
        for (String ele : split) {
            list.add(ele);
        }
        return list;
    }
}
```

### 中缀转后缀表达式

#### 思路分析

很显然，后缀表达式适合计算式进行运算，但是人不太容易写出来，尤其是表达式很长的情况下，因此在开发中，需要将中缀表达式转成后缀表达式

具体步骤如下：

1. 初始化两个栈：运算符栈s1和储存中间结果的栈s2;
2. 从左至右扫描中缀表达式；
3. 遇到操作数时，将其压入s2；
4. 遇到运算符时，比较其与s1栈顶运算符的优先级（小括号不属于运算符）；
	1. 如果s1为空，或栈顶运算符为左括号"("，将该运算符直接入栈
	2. 否则，若优先级比栈顶运算符高，也将运算符压入s1
	3. 否则，将s1栈顶的运算符弹出并压入s2中，再次与s1中的新栈顶运算符比较
5. 遇到括号时：
	1. 如果是左括号"("，直接压入s1
	2. 如果是右括号")"，依次弹出s1栈顶的运算符，并压入s2，直到遇到左括号为止，此时将括号丢弃
6. 重复步骤2至5，直到表达式的最右边
7. 将s1中剩余的运算符依次弹出并压入s2
8. 依次弹出s2中的元素并输出，结果的逆序即为中缀表达式对应的后缀表达式

<img src="https://s2.loli.net/2024/03/31/zZpDjnamCLh4FBV.png" alt="image-20240331104800612" style="zoom:50%;" />

#### 代码实现

不断的遍历中缀表达式，根据不同的情况，来加入不同的值

```java
// 中缀表达式转后缀表达式并计算
public static String computedInfixResult(List<String> list){
    // 初始化两个栈,数栈和结果栈
    Stack<String> stack1 = new Stack<String>();
    Stack<String> stack2 = new Stack<String>();
    for (String val : list) {
        if (val.matches("\\d+")){
            // 数字载入数栈
            stack1.push(val);
        }
        else{
            // 不为数栈
            // 则为运算符或小括号
            // 判断结果栈是否为空,为空或为小括号就直接加入
            if(stack2.isEmpty() || stack2.peek().equals("(")){
                stack2.push(val);
            } else if (priority(val) == -1) {
                // 为小括号,则直接压入栈中
                if (val.equals("("))
                    stack2.push(val);
                else{
                    // 右括号
                    while (true){
                        if (stack2.peek().equals("(")){
                            // 当比较后不为(时,进行循环,依次弹出每一个顶上的数据
                            stack2.pop();
                            break;
                        }else {
                            // 存入其它运算符
                            stack1.push(stack2.pop());
                        }
                    }
                }
            } else if (priority(val) >= priority(stack2.peek())){
                // 如果新的运算符优先级大于栈顶运算符的优先级的话
                stack1.push(stack2.pop());
                // 当结果栈不为空时,比较优先级
                while (!stack2.isEmpty()){
                    if (priority(val) >= priority(stack2.peek())){
                        stack2.push(val);
                    }else break;
                }
            }
        }
    }
    while (!stack2.isEmpty()){
        stack1.push(stack2.pop());
    }
    StringBuilder res = new StringBuilder();
    int size = stack1.size();
    for (int i = 0; i < size; i++) {
        res.append(stack1.pop() + " ");
    }
    return String.valueOf(res.reverse());
}

// 返回运算符的优先级,自定,返回的数字越大优先级越高
public static int priority(String operation){
    if (operation.equals("*") || operation.equals("/")){
        return 1;
    } else if (operation.equals("+") || operation.equals("-")) {
        return 0;
    }else{
        return  -1;     // 假定的表达式只有加减乘除
    }
}


// 将中缀表达式转成对应的List
public static List<String> toInfixExpressionList(String s){
    // 定义List,存放中缀表达式对应的内容
    List<String> ls = new ArrayList<>();
    int i = 0;  // 指针,用于遍历表达式中的字符串
    String str; // 多位数拼接
    char c; // 遍历每一个字符,放入到c中
    do{
        // 如果c不是数字,就加入到ls
        if ((c = s.charAt(i)) < 48 || (c = s.charAt(i)) > 57){
            ls.add("" + c); // 不为数字,说明是运算符,直接加入
            i++;    // 指针后移
        }else{
            // 如果是数字,需要考虑多位数的情况
            str = "";   // 每一次都需要重置该字符串
            while (i < s.length() && (c=s.charAt(i)) >= 48
            && (c=s.charAt(i)) <= 57){
                // 48 - 57 -> 0 ==> 9
                str += c;   // 对数字进行拼接
                i++;
            }
            ls.add(str);
        }
    }while (i < s.length());
    return ls;
}
```

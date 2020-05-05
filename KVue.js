// 实现自己的Vue框架
class KVue {
    constructor(options) {
        // 缓存选项
        this.$options = options;
        // 数据响应化
        this.$data = options.data;
        this.observe(this.$data);

        // 模拟一下Watcher创建过程
        new Watcher();
        this.$data.test;
        new Watcher();
        this.$data.foo.bar;
    }
    observe(value) {
        if (!value || typeof value !== 'object') {
            return
        }

        // 遍历对象
        Object.keys(value).forEach(key => {
            this.defineReactive(value, key, value[key])
        })
    }
    // 数据响应化
    defineReactive(obj, key, val) {
        // 递归解决数据层次嵌套
        this.observe(val);

        const dep = new Dep();
        console.log(Dep)

        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.addDep(Dep.target);
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // console.log(`${key}属性更新了：${val}`);
                dep.notify()
            }
        })
    }
}

// Dep 用来管理Watcher 观察者的集合
class Dep {
    constructor() {
        // 这里存放若干依赖（Watcher）
        this.deps = [];
    }

    // 添加依赖
    addDep(dep) {
        this.deps.push(dep);
    }

    // 通知依赖跟新
    notify() {
        this.deps.forEach(dep => dep.update())
    }
}

// Watcher
class Watcher {
    constructor() {
        // 将当前Watcher的实例指定到Dep静态属性target
        Dep.target = this;
    }

    update() {
        console.log('属性更新了')
    }
}
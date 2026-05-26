interface StorageItem<T> {
  value: T;
  expiresAt: number; // 过期时间的时间戳 (毫秒)
}

class ExpirableStorage {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  /**
   * 获取项，如果已过期则返回 null 并自动移除
   * @param key 键名
   */
  getItem<T>(key: string): null | T {
    const stored = this.storage.getItem(key);
    if (!stored) return null;

    try {
      const item: StorageItem<T> = JSON.parse(stored);
      // 检查是否过期
      if (Date.now() > item.expiresAt) {
        this.storage.removeItem(key); // 自动清理过期数据
        return null;
      }
      return item.value;
    } catch (error) {
      // 如果解析失败，说明数据格式不对，可能是未过期的普通存储，直接返回原值
      console.warn(`Failed to parse stored item for key "${key}"`, error);
      return null;
    }
  }

  /**
   * 移除项
   */
  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * 设置带过期时间的项
   * @param key 键名
   * @param value 要存储的值
   * @param ttl 存活时间（毫秒），例如 7 * 24 * 60 * 60 * 1000 表示7天
   */
  setItem<T>(key: string, value: T, ttl: number): void {
    const expiresAt = Date.now() + ttl;
    const item: StorageItem<T> = {
      value,
      expiresAt,
    };
    this.storage.setItem(key, JSON.stringify(item));
  }
}

// 导出一个默认实例，这里我们使用 localStorage
export const expirableLocalStorage = new ExpirableStorage(localStorage);

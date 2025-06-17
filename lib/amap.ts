/**
 * 高德地图配置文件
 */

// 为 window 对象声明 _AMapSecurityConfig 属性
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
  }
}

// 高德地图 API Key
export const AMAP_KEY = '7504a7aae2eb854a1bcc391e06613ad7';

// 安全密钥
export const AMAP_SECURITY_CODE = 'e304c0676e2e510e4ea17b8ad35fd4bd';

// 设置高德地图安全密钥
export const setupAmapSecurity = () => {
  if (typeof window !== 'undefined') {
    window._AMapSecurityConfig = {
      securityJsCode: AMAP_SECURITY_CODE,
    };
  }
};

// 高德地图配置参数
export const AMAP_CONFIG = {
  key: AMAP_KEY,
  version: '2.0',
  plugins: ['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.ToolBar'],
};

// 获取当前位置
export const getCurrentPosition = (): Promise<{
  position: [number, number];
  address: string;
}> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.AMap) {
      reject(new Error('高德地图JS API未加载'));
      return;
    }

    const geolocation = new window.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      zoomToAccuracy: true,
      buttonPosition: 'RB',
    });

    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        resolve({
          position: [result.position.lng, result.position.lat],
          address: result.formattedAddress,
        });
      } else {
        // 默认位置 - 北京天安门
        resolve({
          position: [116.397428, 39.90923],
          address: '北京市东城区天安门',
        });
      }
    });
  });
};

// 搜索附近地点
export const searchNearbyPlaces = (
  map: any,
  position: [number, number],
  keyword: string = '疫苗接种点',
  radius: number = 5000
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.AMap) {
      reject(new Error('高德地图JS API未加载'));
      return;
    }

    const placeSearch = new window.AMap.PlaceSearch({
      pageSize: 15,
      pageIndex: 1,
      city: '全国',
      type: '医疗保健服务',
      children: 1,
      citylimit: false,
      autoFitView: false,
    });

    placeSearch.searchNearBy(
      keyword,
      position,
      radius,
      (status: string, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          resolve(result.poiList.pois);
        } else {
          resolve([]);
        }
      }
    );
  });
};

// 默认搜索半径 (米)
export const DEFAULT_SEARCH_RADIUS = 5000;

// 地图默认缩放级别
export const DEFAULT_ZOOM = 13;

// 接种点返回数据结构类型定义
export interface VaccineLocation {
  id: string;
  name: string;
  address: string;
  distance: number; // 距离，单位米
  tel: string;
  location: {
    lat: number;
    lng: number;
  };
} 
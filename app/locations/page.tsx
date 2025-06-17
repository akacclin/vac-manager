"use client";

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { MapPin, Phone, Navigation, Clock } from 'lucide-react';
import { AMAP_KEY } from '@/lib/amap';
import Script from 'next/script';

interface LocationItem {
  id: string;
  name: string;
  address: string;
  distance: number;
  tel?: string;
  position: [number, number];
}

export default function LocationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const placeSearchRef = useRef<any>(null);
  
  // 初始化高德地图安全配置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window._AMapSecurityConfig = {
        securityJsCode: 'e304c0676e2e510e4ea17b8ad35fd4bd',
      };
    }
  }, []);
  
  // 处理脚本加载完成事件
  const handleScriptLoad = () => {
    console.log("高德地图脚本加载完成");
    setScriptLoaded(true);
  };
  
  // 初始化地图，在脚本加载完成后执行
  useEffect(() => {
    // 只有在脚本加载完成后才初始化地图
    if (!scriptLoaded) return;
    
    // 只在客户端加载地图
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      
      try {
        setLoading(true);
        console.log("开始初始化地图");
        
        // 等待高德地图脚本加载
        if (!window.AMap) {
          console.error("AMap对象未定义");
          setError('高德地图API未加载，请刷新页面');
          setLoading(false);
          return;
        }
        
        // 创建地图实例
        const map = new window.AMap.Map(mapContainerRef.current, {
          zoom: 13,
          resizeEnable: true,
        });
        
        console.log("地图实例创建成功");
        
        // 保存地图实例
        mapInstanceRef.current = map;
        
        // 创建信息窗口
        const infoWindow = new window.AMap.InfoWindow({
          offset: new window.AMap.Pixel(0, -30)
        });
        
        // 保存信息窗口
        infoWindowRef.current = infoWindow;
        
        // 加载控件插件
        await new Promise<void>((resolve) => {
          window.AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
            console.log("控件插件加载成功");
            try {
              // 添加控件
              map.addControl(new window.AMap.Scale());
              map.addControl(new window.AMap.ToolBar({
                position: 'RB'
              }));
              resolve();
            } catch (e) {
              console.error("添加控件失败:", e);
              resolve();
            }
          });
        });
        
        // 加载定位插件
        await new Promise<void>((resolve) => {
          window.AMap.plugin('AMap.Geolocation', () => {
            console.log("定位插件加载成功");
            try {
              const geolocation = new window.AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                buttonPosition: 'RB',
                buttonOffset: new window.AMap.Pixel(10, 20),
                zoomToAccuracy: true,
              });
              
              map.addControl(geolocation);
              
              geolocation.getCurrentPosition((status: string, result: any) => {
                if (status === 'complete') {
                  // 定位成功
                  console.log("定位成功:", result);
                  const lnglat = result.position;
                  setCurrentPosition([lnglat.lng, lnglat.lat]);
                  setCurrentAddress(result.formattedAddress || '');
                  
                  // 在地图上标记当前位置
                  new window.AMap.Marker({
                    position: lnglat,
                    map: map,
                    icon: new window.AMap.Icon({
                      size: new window.AMap.Size(25, 34),
                      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                      imageSize: new window.AMap.Size(25, 34),
                    }),
                    offset: new window.AMap.Pixel(-12, -34),
                    title: '当前位置'
                  });
                  
                  // 加载地点搜索插件并进行搜索
                  window.AMap.plugin('AMap.PlaceSearch', () => {
                    console.log("搜索插件加载成功");
                    // 初始化地点搜索服务
                    placeSearchRef.current = new window.AMap.PlaceSearch({
                      pageSize: 15,
                      pageIndex: 1,
                      autoFitView: true
                    });
                    
                    // 搜索附近接种点
                    searchNearby(lnglat);
                  });
                } else {
                  // 定位失败，使用默认位置
                  console.error('定位失败', result.message);
                  const defaultLngLat = new window.AMap.LngLat(116.397428, 39.90923);
                  setCurrentPosition([defaultLngLat.lng, defaultLngLat.lat]);
                  setCurrentAddress('定位失败，使用默认位置');
                  
                  // 加载地点搜索插件并进行搜索
                  window.AMap.plugin('AMap.PlaceSearch', () => {
                    // 初始化地点搜索服务
                    placeSearchRef.current = new window.AMap.PlaceSearch({
                      pageSize: 15,
                      pageIndex: 1,
                      autoFitView: true
                    });
                    
                    // 搜索默认位置附近接种点
                    searchNearby(defaultLngLat);
                  });
                }
              });
              
            } catch (e) {
              console.error("定位失败:", e);
              // 使用默认位置
              const defaultLngLat = new window.AMap.LngLat(116.397428, 39.90923);
              setCurrentPosition([defaultLngLat.lng, defaultLngLat.lat]);
              setCurrentAddress('初始化定位失败，使用默认位置');
              
              // 尝试加载搜索插件
              try {
                window.AMap.plugin('AMap.PlaceSearch', () => {
                  // 初始化地点搜索服务
                  placeSearchRef.current = new window.AMap.PlaceSearch({
                    pageSize: 15,
                    pageIndex: 1,
                    autoFitView: true
                  });
                  
                  // 搜索默认位置附近接种点
                  searchNearby(defaultLngLat);
                });
              } catch (searchError) {
                console.error("搜索失败:", searchError);
                setLoading(false);
              }
            }
            resolve();
          });
        });
        
      } catch (err) {
        console.error('初始化地图失败:', err);
        setError('加载地图失败，请检查网络连接');
        setLoading(false);
      }
    };
    
    initMap();
    
    // 清理函数
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [scriptLoaded]);
  
  // 搜索附近接种点
  const searchNearby = (centerLngLat: any) => {
    if (!placeSearchRef.current) {
      console.error("未初始化PlaceSearch");
      return;
    }
    
    const keyword = "疫苗接种点";
    const radius = 5000; // 搜索半径，单位：米
    
    // 清除之前的标记
    clearAllMarkers();
    
    console.log("开始搜索附近接种点");
    placeSearchRef.current.searchNearBy(keyword, centerLngLat, radius, (status: string, result: any) => {
      console.log("搜索结果状态:", status);
      if (status === 'complete' && result.info === 'OK') {
        console.log("搜索成功，结果数量:", result.poiList.pois.length);
        renderSearchResults(result.poiList.pois);
      } else {
        console.log("未找到结果或搜索失败");
        setLocations([]);
        setLoading(false);
      }
    });
  };
  
  // 渲染搜索结果到地图和列表
  const renderSearchResults = (pois: any[]) => {
    if (!pois || pois.length === 0) {
      setLocations([]);
      setLoading(false);
      return;
    }
    
    // 处理搜索结果
    const locationsList = pois.map((poi, index) => ({
      id: poi.id,
      name: poi.name,
      address: poi.address || '未知地址',
      distance: poi.distance || 0,
      tel: poi.tel || '',
      position: [poi.location.lng, poi.location.lat] as [number, number],
      index: index + 1  // 为每个位置添加序号
    }));
    
    setLocations(locationsList);
    
    // 添加接种点标记
    const markers = locationsList.map(location => {
      const marker = new window.AMap.Marker({
        position: location.position,
        map: mapInstanceRef.current,
        title: location.name,
        label: {
          content: String(location.index),
          direction: 'center'
        }
      });
      
      // 添加点击事件
      marker.on('click', () => {
        openInfoWindow(location, marker);
        setSelectedLocation(location.id);
        // 滚动到对应列表项
        document.getElementById(`location-${location.id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      });
      
      return marker;
    });
    
    markersRef.current = markers;
    setLoading(false);
  };
  
  // 打开信息窗口
  const openInfoWindow = (location: LocationItem, marker: any) => {
    if (!infoWindowRef.current) return;
    
    const content = `
      <div style="font-family: 'Microsoft YaHei', 'sans-serif';">
        <h4 style="margin:5px 0; font-size:16px;">${location.name}</h4>
        <p style="margin:5px 0; font-size:14px; color:#555;">地址：${location.address}</p>
        <p style="margin:5px 0; font-size:14px; color:#555;">电话：${location.tel || '暂无'}</p>
      </div>
    `;
    
    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(mapInstanceRef.current, marker.getPosition());
    mapInstanceRef.current.setCenter(marker.getPosition());
  };
  
  // 清除地图上所有标记
  const clearAllMarkers = () => {
    if (markersRef.current && markersRef.current.length > 0) {
      mapInstanceRef.current.remove(markersRef.current);
      markersRef.current = [];
    }
  };
  
  // 处理地点点击
  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId);
    
    const location = locations.find(loc => loc.id === locationId);
    if (location && mapInstanceRef.current && markersRef.current) {
      // 设置地图中心
      mapInstanceRef.current.setCenter(location.position);
      
      // 找到对应的标记
      const marker = markersRef.current.find((m: any) => {
        const pos = m.getPosition();
        return pos.lng === location.position[0] && pos.lat === location.position[1];
      });
      
      if (marker) {
        // 打开信息窗口
        if (infoWindowRef.current) {
          const content = `
            <div style="font-family: 'Microsoft YaHei', 'sans-serif';">
              <h4 style="margin:5px 0; font-size:16px;">${location.name}</h4>
              <p style="margin:5px 0; font-size:14px; color:#555;">地址：${location.address}</p>
              <p style="margin:5px 0; font-size:14px; color:#555;">电话：${location.tel || '暂无'}</p>
            </div>
          `;
          
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstanceRef.current, marker.getPosition());
        }
        
        // 尝试使用正确的方式添加动画
        try {
          // 高德地图2.0中标记动画的正确使用方法
          if (marker.setAnimation) {
            marker.setAnimation('AMAP_ANIMATION_BOUNCE');
            setTimeout(() => {
              marker.setAnimation(null);
            }, 2000);
          } else if (window.AMap && window.AMap.AnimationMarker) {
            // 如果支持AnimationMarker，则使用此方法
            const position = marker.getPosition();
            const animMarker = new window.AMap.AnimationMarker({
              position: position,
              map: mapInstanceRef.current,
              animation: 'AMAP_ANIMATION_BOUNCE'
            });
            
            setTimeout(() => {
              animMarker.setMap(null);
            }, 2000);
          } else {
            // 如果不支持动画，至少让它闪烁一下
            const originalIcon = marker.getIcon();
            const originalContent = marker.getLabel().content;
            
            // 修改样式使其突出
            marker.setLabel({
              content: originalContent,
              direction: 'center',
              style: {
                color: '#fff',
                backgroundColor: '#f00',
                border: '1px solid #fff',
                fontWeight: 'bold'
              }
            });
            
            // 2秒后恢复原样
            setTimeout(() => {
              marker.setLabel({
                content: originalContent,
                direction: 'center'
              });
            }, 2000);
          }
        } catch (e) {
          console.error("设置标记动画失败:", e);
        }
      }
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* 加载高德地图脚本 */}
      <Script
        id="amap-script"
        src={`https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Geolocation,AMap.PlaceSearch,AMap.Scale,AMap.ToolBar`}
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />
    
      <PageHeader title="附近接种点" showBackButton />
      
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl lg:max-w-5xl">
          {/* 地图容器 */}
          <div 
            ref={mapContainerRef}
            className="w-full h-[40vh] sm:h-[45vh] bg-slate-100 relative"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 z-10">
                <div className="text-slate-500">地图加载中...</div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 z-10">
                <div className="text-red-500">{error}</div>
              </div>
            )}
          </div>
          
          {/* 位置列表 */}
          <div className="px-4 sm:px-6 py-4 space-y-3">
            {currentPosition && (
              <div className="text-sm text-slate-500 mb-2 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>当前位置: {currentAddress || '未知位置'}</span>
              </div>
            )}
            
            {loading ? (
              <div className="flex items-center justify-center h-20">
                <p className="text-slate-500">搜索附近接种点...</p>
              </div>
            ) : locations.length === 0 ? (
              <Card className="p-6 text-center shadow-sm">
                <p className="text-slate-500">附近5公里未找到接种点</p>
              </Card>
            ) : (
              locations.map(location => (
                <Card 
                  key={location.id}
                  id={`location-${location.id}`}
                  className={`p-4 cursor-pointer transition-colors shadow-sm ${
                    selectedLocation === location.id ? 'bg-sky-50 border-sky-200' : ''
                  }`}
                  onClick={() => handleLocationClick(location.id)}
                >
                  <h3 className="font-medium text-base">
                    <span className="inline-flex items-center justify-center bg-sky-500 text-white rounded-full w-5 h-5 text-xs mr-2">
                      {(location as any).index || ''}
                    </span>
                    {location.name}
                  </h3>
                  
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{location.address}</span>
                    </div>
                    
                    {location.tel && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <a 
                          href={`tel:${location.tel}`} 
                          className="text-sky-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {location.tel}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-slate-400" />
                      <span>
                        距离: {(location.distance / 1000).toFixed(1)} 公里
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 같은 네트워크의 다른 PC(윈도우 테스트용)에서 개발 서버에 접속할 때.
     이 주소들은 Mac의 LAN IP 다. 없으면 HMR 소켓과 dev 자원이 교차 출처로 막힌다. */
  allowedDevOrigins: ["192.168.0.96", "192.168.0.*"],
  // 블로그는 /blog 로 옮겼다. 메뉴 초기 주소였던 /news/blog 를 영구 이동한다.
  async redirects() {
    return [{ source: "/news/blog", destination: "/blog", permanent: true }];
  },
};

export default nextConfig;

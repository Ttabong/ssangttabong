// src/components/Footer.tsx
export default function Footer() {
  return (
      <footer>
        <div className="container footer-inner flex justify-between items-center">
          <div className="text-left">수부동산공인중개사사무소 <br/>
                대표 민용기 | 등록번호 11215202300104    <br/>
                소재지 서울특별시 광진구 자양제3동 583-15 <br/>
                전화 02-447-9088</div>

          <div className="text-right"> © 2025 Soo&Ssanttabong. All rights reserved.</div>

     {/*     <ul className="social-links">
           <li>
              <a href="#" aria-label="youtube">
                youtube
              </a>
            </li>
            <li>
              <a href="#" aria-label="blog">
                Blog
              </a>
            </li>
            <li>
              <a href="#" aria-label="Instagram">
                Instagram
              </a>
            </li> 


          </ul> */} 
        </div>
      </footer>
  )
}


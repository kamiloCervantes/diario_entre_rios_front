import TopBar from '@/components/layout/TopBar'
import BreakingTicker from '@/components/layout/BreakingTicker'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HomeClient from '@/components/home/HomeClient'

import {
  getFeaturedArticle,
  getLocalArticles,
  getNacionalArticles,
  getCronicasArticles,
  getMostReadArticles,
  getAllArticles,
  getBreakingNews,
  getTrending,
} from '@/lib/api/newsService'

// Server Component — data fetching happens here
export default async function Home() {
  const [featured, local, nacional, cronicas, masLeidas, all, breaking, trending] =
    await Promise.all([
      getFeaturedArticle(),
      getLocalArticles(),
      getNacionalArticles(),
      getCronicasArticles(),
      getMostReadArticles(),
      getAllArticles(),
      getBreakingNews(),
      getTrending(),
    ])

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <BreakingTicker items={breaking} />
      <Navbar />

      <main className="flex-1">
        <HomeClient
          featured={featured}
          local={local}
          nacional={nacional}
          cronicas={cronicas}
          masLeidas={masLeidas}
          trending={trending}
          all={all}
        />
      </main>

      <Footer />
    </div>
  )
}

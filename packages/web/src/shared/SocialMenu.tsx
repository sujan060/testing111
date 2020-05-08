import Discord from 'src/icons/Discord'
import Discourse from 'src/icons/Discourse'
import Instagram from 'src/icons/Instagram'
import MediumLogo from 'src/icons/MediumLogo'
import Octocat from 'src/icons/Octocat'
import { TweetLogo } from 'src/icons/TwitterLogo'
import YouTube from 'src/icons/YouTube'
import { CeloLinks } from 'src/shared/menu-items'
import { colors, UnionColors } from 'src/styles'

const ICON_SIZE = 13

export function socialMenu(color: UnionColors = colors.dark, size = ICON_SIZE) {
  return [
    {
      name: 'Blog',
      link: CeloLinks.mediumPublication,
      icon: <MediumLogo height={size} color={color} />,
    },
    {
      name: 'GitHub',
      link: CeloLinks.gitHub,
      icon: <Octocat size={size} color={color} />,
    },
    {
      name: 'Twitter',
      link: CeloLinks.twitter,
      icon: <TweetLogo height={size} color={color} />,
    },
    {
      name: 'Forum',
      link: CeloLinks.discourse,
      icon: <Discourse size={size} color={color} />,
    },
    {
      name: 'Chat',
      link: CeloLinks.discord,
      icon: <Discord size={size} color={color} />,
    },
    {
      name: 'YouTube',
      link: CeloLinks.youtube,
      icon: <YouTube size={size} color={color} />,
    },
    { name: 'Instagram', link: CeloLinks.instagram, icon: <Instagram size={size} color={color} /> },
  ]
}

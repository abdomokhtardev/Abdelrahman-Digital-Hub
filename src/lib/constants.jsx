import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaFacebook, FaTelegram, FaWhatsapp } from 'react-icons/fa6'

export const SOCIAL_LINKS = [
  {
    key: 'github',
    label: 'GitHub',
    color: 'hover:text-ink dark:hover:text-white',
    icon: <FaGithub className="h-5 w-5" />,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    color: 'hover:text-[#0077b5]',
    icon: <FaLinkedin className="h-5 w-5" />,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    color: 'hover:text-[#e1306c]',
    icon: <FaInstagram className="h-5 w-5" />,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    color: 'hover:text-[#ff0000]',
    icon: <FaYoutube className="h-5 w-5" />,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    color: 'hover:text-[#1877f2]',
    icon: <FaFacebook className="h-5 w-5" />,
  },
  {
    key: 'telegram',
    label: 'Telegram',
    color: 'hover:text-[#2ca5e0]',
    icon: <FaTelegram className="h-5 w-5" />,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    color: 'hover:text-[#25D366]',
    icon: <FaWhatsapp className="h-5 w-5" />,
  },
]

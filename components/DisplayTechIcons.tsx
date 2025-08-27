import React from 'react'
import { cn, getTechLogos } from '@/lib/utils';
import { TechIconsProps } from '@/types';
import Image from 'next/image';

const DisplayTechIcons = async ({techstack}:TechIconsProps) => {
  const techIcons = await getTechLogos(techstack);
    return (
    <div>
     <div className="flex flex-row ">{techIcons.slice(0, 3).map(({tech, url},index)=>(
        <div key={index} className={cn('relatve group bg-dark-300 rounded-full p-2 flex-center',index >= 1 && '-ml-3')}>
            <span className='tech-tooltip'>
                {tech}
            </span>
            <Image src={url} alt={tech} width={100} height={100} className='size-5' />
        </div>
     ))}</div>
    </div>
  )
}

export default DisplayTechIcons

export type TeamRole = "OC" | "MC";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  committee: TeamRole;
  department?: string;
  university?: string;
  image: string;
  phone?: string;
  email?: string;
}

export const mainCommittee: TeamMember[] = [
  {
    id: "mc-president",
    name: "Dinuka Avinash",
    role: "Member Committee President & Organizational Development",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652683/MC_DPs_-_1_r3fowe.png",
  },

  {
    id: "mc-vp-1",
    name: "Shymal De Silva",
    role: "MCVP — Business to Customer",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652687/MC_DPs_-_2_hh84dw.png",
  },
  {
    id: "mc-vp-2",
    name: "Ijas Ahamed",
    role: "MCVP — Business Development & Public Relations",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652705/MC_DPs_-_3_ygnqyz.png",
  },
  {
    id: "mc-vp-3",
    name: "Matheen Mohammed",
    role: "MCVP — Brand & Marketing",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652713/MC_DPs_-_4_gmftd8.png",
  },
  {
    id: "mc-vp-4",
    name: "Akesh Chandrasiri",
    role: "MCVP — Customer Experience and Operations & Information Management",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652704/MC_DPs_-_5_xjgnbv.png",
  },
  {
    id: "mc-vp-5",
    name: "Avishka Chanuka",
    role: "MCVP — Expansion Development & Organizational Development Management",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652704/MC_DPs_-_6_kgo3dx.png",
  },
  {
    id: "mc-vp-6",
    name: "Sajana Kankanige",
    role: "MCVP — Finance & Legal",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652701/MC_DPs_-_7_xkfgdi.png",
  },
  {
    id: "mc-vp-7",
    name: "Sandaru Gangul",
    role: "MCVP — Incoming Global Talent & Teacher",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652708/MC_DPs_-_8_pyo6es.png",
  },
  {
    id: "mc-vp-8",
    name: "Dinan Jayasuriya",
    role: "MCVP — Incoming Global Volunteer",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652719/MC_DPs_-_9_klpp8c.png",
  },
  {
    id: "mc-vp-9",
    name: "Malini Kumburage",
    role: "MCVP — Outgoing Global Talent & Teacher",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652725/MC_DPs_-_10_mwcaga.png",
  },
  {
    id: "mc-vp-10",
    name: "Geethma Ramawickrama",
    role: "MCVP — Outgoing Global Volunteer",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652722/MC_DPs_-_11_y0bbty.png",
  },
  {
    id: "mc-vp-11",
    name: "Madupa Jayarathna",
    role: "MCVP — Talent Management",
    committee: "MC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652720/MC_DPs_-_12_h4yidg.png",
  },
];

export const organizingCommittee: TeamMember[] = [
  {
    id: "oc-cm-1",
    name: "Ijas Ahamed",
    role: "Conference Manager",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652705/MC_DPs_-_3_ygnqyz.png",
  },
  {
    id: "oc-cm-2",
    name: "Shymal De Silva",
    role: "Conference Manager",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787652687/MC_DPs_-_2_hh84dw.png",
  },

  // ── President ────────────────────────────────────────────────────────────
  {
    id: "oc-president",
    name: "Suprajan Jeyapal",
    role: "Organizing Committee President",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579408/Suprajan_Jeyapal_-_OCP_n4pusn.jpg",
  },

  // ── Vice President — Finance ──────────────────────────────────────────────
  {
    id: "oc-vp-finance",
    name: "Sasin Perera",
    role: "OC Vice President — Finance",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579436/Sasin_Perera_-_FIN_zo08hz.jpg",
  },

  // ── Vice President — Delegates ────────────────────────────────────────────
  {
    id: "oc-vp-delegates-1",
    name: "Sayuri Pathirana",
    role: "OC Vice President — Delegates",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579406/Sayuri_Pathirana_-_DEL_ghtuo1.jpg",
  },
  {
    id: "oc-vp-delegates-2",
    name: "Monali Edrisinghe",
    role: "OC Vice President — Delegates",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579403/Monali_Edrisinghe_-_DEL_oasxft.jpg",
  },
  {
    id: "oc-vp-delegates-3",
    name: "Sayuni Salwathura",
    role: "OC Vice President — Delegates",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579404/Salwathura_Sayuni_-_DEL_qtamdq.jpg",
  },

  // ── Vice President — Partnership Development ──────────────────────────────
  {
    id: "oc-vp-pd-1",
    name: "Alex Dinith",
    role: "OC Vice President — Partnership Development",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579403/Alex_Dinith_-_PD_tzswdm.jpg",
    phone: "+94 70 654 4700",
    email: "alexdinith04@aiesec.net",
  },
  {
    id: "oc-vp-pd-2",
    name: "Binithi Sarithya",
    role: "OC Vice President — Partnership Development",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579402/Binithi_Sarithya_-_PD_mtfo0e.jpg",
    phone: "+94 75 877 4090",
    email: "binithi.sarithya@aiesec.net",
  },
  {
    id: "oc-vp-pd-3",
    name: "Vinuthi Hirimuthugoda",
    role: "OC Vice President — Partnership Development",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579408/Vinuthi_Hirimuthugoda_-_PD_z58y7q.jpg",
    phone: "+94 72 422 4514",
    email: "vinuthi.hirimuthugoda@aiesec.net",
  },

  // ── Vice President — Logistics ────────────────────────────────────────────
  {
    id: "oc-vp-logistics-1",
    name: "Dihan Masinghe",
    role: "OC Vice President — Logistics",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579403/Dihan_Masinghe_-_LOG_sszmsx.jpg",
  },
  {
    id: "oc-vp-logistics-2",
    name: "Rageeshan Chandrasegaran",
    role: "OC Vice President — Logistics",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579404/Rageeshan_Chandrasegaran_-_LOG_poeu2i.jpg",
  },
  {
    id: "oc-vp-logistics-3",
    name: "Vidath Amunugama",
    role: "OC Vice President — Logistics",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1790322696/IMG_2392_dd7njr.jpg",
  },
  {
    id: "oc-vp-logistics-4",
    name: "Manuthi Manethmi",
    role: "OC Vice President — Logistics",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579403/Manuthi_Manethmi_-_LOG_bmrpbj.jpg",
  },

  // ── Vice President — Marketing ────────────────────────────────────────────
  {
    id: "oc-vp-marketing-1",
    name: "Habikugasarma Kuganeshwarasarma",
    role: "OC Vice President — Marketing",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787579403/Habikugasarma_Kuganeshwarasarma_-_MKT_y4uzp6.jpg",
  },
  {
    id: "oc-vp-marketing-2",
    name: "Michelle Warnakulasooriya",
    role: "OC Vice President — Marketing",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1787580319/Michelle_Warnakulasooriya-_MKT_fzvfx2.jpg",
  },
  {
    id: "oc-vp-marketing-3",
    name: "Tharinda Dinujaya",
    role: "OC Vice President — Marketing",
    committee: "OC",
    image:
      "https://res.cloudinary.com/daamlqcer/image/upload/v1790322729/IMG_2367_pj7dv5.jpg",
  },
];

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client-next/app/internships/page.js');
let content = fs.readFileSync(filePath, 'utf-8');

const s1 = `import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';`;
const r1 = `import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';`;

const s2 = `<h3
                          className="role-title"
                          onClick={() =>
                            router.push(\`/internships/\${internship._id}\`, {
                              state: { internship },
                            })
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {internship.role}
                        </h3>`;
const r2 = `<Link 
                          href={\`/internships/\${internship.slug || internship._id}\`}
                          className="role-title"
                          style={{ textDecoration: 'none', display: 'block' }}
                        >
                          <h3>{internship.role}</h3>
                        </Link>`;

const s3 = `<button
                        className="apply-btn"
                        onClick={() =>
                          router.push(\`/internships/\${internship._id}\`, {
                            state: { internship },
                          })
                        }
                      >
                        Apply Now
                        <ChevronRight size={18} />
                      </button>`;
const r3 = `<Link
                        href={\`/internships/\${internship.slug || internship._id}\`}
                        className="apply-btn"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                      >
                        Apply Now
                        <ChevronRight size={18} />
                      </Link>`;

if (content.includes(s1)) console.log("s1 found");
if (content.includes(s2)) console.log("s2 found");
if (content.includes(s3)) console.log("s3 found");

content = content.replace(s1, r1);
content = content.replace(s2, r2);
content = content.replace(s3, r3);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Successfully replaced links in page.js");

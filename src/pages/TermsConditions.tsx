import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Layout from '../components/common/Layout/Layout'

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <div className="policy-page">
        {/* Breadcrumb Navigation */}
        <div className="policy-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="policy-breadcrumb-link">
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="policy-breadcrumb-current">Terms &amp; Conditions</span>
        </div>

        <article className="policy-container">
          <header className="policy-header">
            <span className="policy-brand-tag">The Gifted Pencil</span>
            <h1 className="policy-title">TERMS &amp; CONDITIONS</h1>
            <div className="policy-divider" aria-hidden="true" />
          </header>

          <div className="policy-body">
            <p className="policy-intro">
              Welcome to The Gifted Pencil! By purchasing or using this journal, you agree to the following Terms &amp; Conditions.
            </p>

            <section className="policy-section">
              <h2 className="policy-section-title">1. Purpose of the Journal</h2>
              <p>
                The Gifted Pencil is designed to encourage creativity, self-reflection, positive thinking, goal-setting and personal growth. The journal is intended for personal development and educational purposes.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">2. Personal Use Only</h2>
              <p>
                This journal is intended for individual personal use. Reproduction, resale, redistribution, photocopying, scanning, sharing or commercial use of its content without prior written permission is strictly prohibited.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">3. Intellectual Property Rights</h2>
              <p>
                All content, including journal prompts, exercises, illustrations, designs, layouts, written material and branding, belongs to The Gifted Pencil or its respective creators. Unauthorized copying or distribution is not permitted.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">4. No Guarantee of Results</h2>
              <p>
                The activities, exercises and prompts provided in this journal are intended to support personal reflection and growth. Individual experiences and outcomes may vary. We do not guarantee specific personal, academic, emotional or professional results.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">5. Responsible Usage</h2>
              <p>
                Users are encouraged to complete the activities honestly and at their own pace. The journal is not a substitute for professional medical, psychological, educational or therapeutic advice.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">6. Age-Appropriate Usage</h2>
              <p>
                Children should use the journal according to the intended age group. Parental or guardian guidance is recommended wherever appropriate.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">7. Product Disclaimer</h2>
              <p>
                Every effort has been made to ensure the accuracy and quality of the journal content. However, minor printing, colour and formatting variations may occur in physical copies.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">8. Refunds and Replacements</h2>
              <p>
                Refunds, returns or replacements for physical journals will be governed by the applicable Return, Refund and Replacement Policy. Any manufacturing defects or damaged products should be reported within the specified reporting period.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">9. Limitation of Liability</h2>
              <p>
                The Gifted Pencil shall not be held responsible for decisions, actions or outcomes arising from the use or interpretation of the journal&apos;s content.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify or update these Terms &amp; Conditions whenever necessary. The latest version will apply to future purchases and usage.
              </p>
            </section>

            <section className="policy-section">
              <h2 className="policy-section-title">11. Acceptance</h2>
              <p>
                By purchasing or using The Gifted Pencil, you acknowledge that you have read, understood and agreed to these Terms &amp; Conditions.
              </p>
            </section>

            <div className="policy-divider" aria-hidden="true" />

            {/* COPYRIGHT NOTICE */}
            <section className="policy-special-block">
              <h2 className="policy-special-title">COPYRIGHT NOTICE</h2>
              <p className="policy-copyright-badge">&copy; 2026 The Gifted Pencil. All Rights Reserved.</p>
              <p>
                The Gifted Pencil is an original journal created to inspire creativity, self-awareness, positive thinking and personal growth.
              </p>
              <p>
                All content in this journal, including written material, activities, prompts, illustrations, exercises, designs and layouts, is protected by intellectual property laws.
              </p>
              <p>
                No part of this publication may be copied, reproduced, modified, distributed, published, stored or commercially used in any form without prior written permission from the publisher.
              </p>
              <p>This journal is intended for personal use only.</p>
              <p className="policy-signature">The Gifted Pencil</p>
            </section>

            <div className="policy-divider" aria-hidden="true" />

            {/* DISCLAIMER */}
            <section className="policy-special-block">
              <h2 className="policy-special-title">DISCLAIMER</h2>
              <p>
                The Gifted Pencil is designed to encourage self-expression, creativity, reflection, positive habits and personal development.
              </p>
              <p>
                The activities and exercises in this journal are intended for educational and personal enrichment purposes only.
              </p>
              <p>
                This journal does not replace professional medical, psychological, counselling or educational advice.
              </p>
              <p>
                Every individual is unique, and personal growth happens at different stages and at different speeds. There is no right or wrong way to express yourself through these pages.
              </p>
              <p>
                We encourage you to approach every activity with curiosity, honesty and an open mind.
              </p>
              <p>
                Remember, this journal is a tool to help you explore your thoughts, recognise your strengths and celebrate your progress.
              </p>
              <p className="policy-highlight-quote">Your journey is yours. Make every page count!</p>
            </section>

            <div className="policy-divider" aria-hidden="true" />

            {/* A NOTE TO PARENTS */}
            <section className="policy-special-block">
              <h2 className="policy-special-title">A NOTE TO PARENTS</h2>
              <p className="policy-salutation">Dear Parents,</p>
              <p>Thank you for welcoming The Gifted Pencil into your child&apos;s journey.</p>
              <p>
                Childhood is a beautiful stage of discovery, imagination and learning. The Gifted Pencil is created to give children a space to express their thoughts, explore their creativity, recognise their strengths and develop positive habits.
              </p>
              <p>As parents, your encouragement can make this experience even more meaningful.</p>
              <p>Here are a few ways you can support your child:</p>
              <ul className="policy-bullet-list">
                <li>
                  <strong>Encourage Consistency:</strong> Help your child spend a few minutes regularly with the journal.
                </li>
                <li>
                  <strong>Allow Freedom:</strong> Let your child express thoughts and feelings without fear of being judged.
                </li>
                <li>
                  <strong>Celebrate Effort:</strong> Appreciate participation and progress rather than expecting perfection.
                </li>
                <li>
                  <strong>Ask Meaningful Questions:</strong> Encourage conversations about what your child writes, draws and discovers.
                </li>
                <li>
                  <strong>Respect Their Space:</strong> Allow your child to have personal thoughts and reflections.
                </li>
                <li>
                  <strong>Lead by Example:</strong> Practise gratitude, goal-setting and positive thinking together.
                </li>
              </ul>
              <p>Please remember that every child is different. Avoid comparing their progress with others.</p>
              <p>
                Our intention is not to create perfect children, but to encourage confident, curious, creative and self-aware individuals.
              </p>
              <p>Thank you for being part of this journey.</p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  )
}

export default TermsConditions

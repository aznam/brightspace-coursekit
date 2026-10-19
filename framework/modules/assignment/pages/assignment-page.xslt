<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:s="urn:coursekit:semantic"
    xmlns:p="urn:coursekit:page"
    xmlns:xsp="urn:coursekit:preprocessor"
    version="1.0">

    <xsl:import href="$(frameworkRoot)/pages/course-page/transform.xslt"/>
    <xsl:output method="xml"/>

    <xsl:template match="/s:content">
        <p:assignment-page>
            <p:meta>
                <p:var name="course-code" ref="course.code"/>
                <p:var name="module-name" value="{@module-name}"/>
                <p:var name="assignment-id" ref="assignment.id"/>
                <p:var name="assignment-label" ref="assignment.label"/>
                <p:var name="assignment-open" ref="assignment.open"/>
                <p:var name="assignment-deadline-at" ref="assignment.deadline.at"/>
                <p:var name="assignment-deadline-type" ref="assignment.deadline.type"/>
                <p:var name="assignment-deadline-extension-at" ref="assignment.deadline.extension.at"/>
                <p:var name="assignment-deadline-extension-reason" ref="assignment.deadline.extension.reason"/>
                <p:var name="assignment-submission-url" ref="assignment.submission.url"/>
                <p:var name="assignment-submission-type" ref="assignment.submission.type"/>
                <p:var name="assignment-submission-group-size" ref="assignment.submission.groupSize"/>
                <p:var name="assignment-ai-policy" ref="assignment.aiPolicy"/>
                <p:var name="assignment-learning-outcomes" ref="assignment.learningOutcomes"/>
                <p:var name="assignment-estimated-time" ref="assignment.estimatedTime"/>
                <p:var name="assignment-difficulty" ref="assignment.difficulty"/>
                <p:var name="assignment-weight" ref="assignment.weight"/>
                <p:var name="assignment-points" ref="assignment.points"/>
                <p:var name="assignment-rubrics-provided" ref="assignment.rubrics.provided"/>
            </p:meta>

            <p:assignment-layout assignment-ref="{@assignment-ref}">
                <xsl:copy-of select="@title | @subtitle | @image | @background | @style-ref | @variant | @page-numbered"/>

                <p:navbar
                    course-code="${{course-code}}"
                    page-title="${{assignment-id}}"
                    module-title="${{module-name}}">
                    <xsl:if test="@theme-switch = 'true'">
                        <p:theme-switch/>
                    </xsl:if>
                    <xsp:slot name="navbar-items">
                        <xsl:apply-templates select="*" mode="navbar"/>
                    </xsp:slot>
                </p:navbar>

                <p:assignment-band
                    open="${{assignment-open}}"
                    deadline-at="${{assignment-deadline-at}}"
                    deadline-type="${{assignment-deadline-type}}"
                    deadline-extension-at="${{assignment-deadline-extension-at}}"
                    deadline-extension-reason="${{assignment-deadline-extension-reason}}"
                    submission-type="${{assignment-submission-type}}"
                    submission-group-size="${{assignment-submission-group-size}}"
                    ai-policy="${{assignment-ai-policy}}"
                    learning-outcomes="${{assignment-learning-outcomes}}"
                    estimated-time="${{assignment-estimated-time}}"
                    difficulty="${{assignment-difficulty}}"
                    weight="${{assignment-weight}}"
                    points="${{assignment-points}}"
                    rubrics-provided="${{assignment-rubrics-provided}}">
                    <xsl:for-each select="s:assignment-outcome">
                        <p:hoverbox title="{@code}" panel-title="{@code}" style-ref="aband-lo-tag">
                            <xsl:value-of select="@description"/>
                        </p:hoverbox>
                    </xsl:for-each>
                </p:assignment-band>

                <p:assignment-hero label="${{assignment-label}}">
                    <xsl:copy-of select="@title | @subtitle | @image"/>
                </p:assignment-hero>

                <xsl:if test="*[1][self::s:summary]">
                    <xsl:apply-templates select="*[1][self::s:summary]"/>
                </xsl:if>

                <p:sidebar-before>
                    <p:assignment-submit
                        deadline-at="${{assignment-deadline-at}}"
                        deadline-type="${{assignment-deadline-type}}"
                        deadline-extension-at="${{assignment-deadline-extension-at}}"
                        deadline-extension-reason="${{assignment-deadline-extension-reason}}"
                        submission-url="${{assignment-submission-url}}"/>
                    <xsl:apply-templates select="s:information[not(preceding-sibling::*[local-name() = 'section'])]"/>
                </p:sidebar-before>

                <p:central-content>
                    <xsl:if test="@toc = 'true'">
                        <p:inline-toc>
                            <xsp:slot name="toc-items">
                                <xsl:apply-templates select="*" mode="toc"/>
                            </xsp:slot>
                        </p:inline-toc>
                    </xsl:if>
                    <xsl:apply-templates select="*[not(self::s:information) and not(self::s:summary[not(preceding-sibling::*)]) and not(self::s:assignment-outcome)]"/>
                </p:central-content>

                <p:sidebar-after>
                    <xsl:apply-templates select="s:information[preceding-sibling::*[local-name() = 'section']]"/>
                </p:sidebar-after>
            </p:assignment-layout>
        </p:assignment-page>
    </xsl:template>
</xsl:stylesheet>

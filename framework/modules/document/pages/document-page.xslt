<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="urn:coursekit:semantic" xmlns:d="urn:coursekit:semantic:document" xmlns:p="urn:coursekit:page" version="1.0">
  <xsl:import href="$(frameworkRoot)/pages/course-page/transform.xslt"/>
  <xsl:output method="xml"/>
  <xsl:template match="/s:content">
    <p:document-page>
      <p:meta>
        <p:var name="course-code" ref="course.code"/>
        <p:var name="course-title" ref="course.title"/>
        <p:var name="course-section" ref="course.section"/>
        <p:var name="course-term" ref="course.term"/>
        <p:var name="course-year" ref="course.year"/>
      </p:meta>
      <p:document-layout>
        <xsl:copy-of select="@cover|@style-ref|@variant"/>
        <p:document-toolbar/>
        <p:document-cover>
          <p:document-cover-brand code="${{course-code}}" course="${{course-title}}" logo="{@institution-logo}" institution="{@institution-name}" faculty="{@institution-faculty}" department="{@institution-department}" program="{@program-name}"/>
          <p:document-cover-title title="{@title}" subtitle="{@subtitle}" kicker="{@kicker}"/>
          <p:document-cover-meta section="${{course-section}}" term="${{course-term}}" year="${{course-year}}" author="{@instructor}" date="{@date}" version="{@version}"/>
        </p:document-cover>
        <p:document-blank/>
        <p:document-sheet>
          <p:document-page-frame>
            <p:document-header code="${{course-code}}" course="${{course-title}}" section="${{course-section}}" logo="{@institution-logo}"/>
            <p:document-body/>
            <p:document-footer program="{@program-name}" text="{@footer-text}" term="${{course-term}}" year="${{course-year}}"/>
          </p:document-page-frame>
        </p:document-sheet>
        <p:document-flow>
          <xsl:apply-templates select="node()" mode="doc"/>
        </p:document-flow>
        <p:document-end/>
      </p:document-layout>
    </p:document-page>
  </xsl:template>
  <xsl:template match="s:section|d:section" mode="doc">
    <p:document-section title="{@title}">
      <xsl:copy-of select="@id"/>
      <xsl:apply-templates select="node()" mode="doc"/>
    </p:document-section>
  </xsl:template>
  <xsl:template match="s:paragraph" mode="doc">
    <p:document-paragraph>
      <xsl:apply-templates select="node()" mode="doc-inline"/>
    </p:document-paragraph>
  </xsl:template>
  <xsl:template match="text()" mode="doc-inline">
    <xsl:value-of select="."/>
  </xsl:template>
  <xsl:template match="s:important" mode="doc-inline">
    <p:text-style variant="important">
      <xsl:apply-templates select="node()" mode="doc-inline"/>
    </p:text-style>
  </xsl:template>
  <xsl:template match="s:note|s:information" mode="doc">
    <p:document-note title="{@title}">
      <xsl:apply-templates select="node()" mode="doc"/>
    </p:document-note>
  </xsl:template>
  <xsl:template match="s:list" mode="doc">
    <p:document-list>
      <xsl:apply-templates select="node()" mode="doc"/>
    </p:document-list>
  </xsl:template>
  <xsl:template match="s:item" mode="doc">
    <p:item>
      <xsl:apply-templates select="node()" mode="doc-inline"/>
    </p:item>
  </xsl:template>
  <xsl:template match="s:picture" mode="doc">
    <p:document-figure src="{@src}" alt="{normalize-space(.)}" caption="{@title}"/>
  </xsl:template>
  <xsl:template match="d:author" mode="doc">
    <p:document-author name="{@name}" role="{@role}"/>
  </xsl:template>
  <xsl:template match="d:break" mode="doc">
    <p:document-break/>
  </xsl:template>
</xsl:stylesheet>
